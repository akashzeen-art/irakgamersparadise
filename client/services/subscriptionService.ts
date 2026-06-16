import {
  APIParams,
  CONTENT_DOMAIN,
  CONTENT_PORTAL_PATH,
  DEFAULT_PRODUCTCODE,
  DEFAULT_SUBID,
  SESSION_SUBID_KEY,
  SUBSCRIPTION_PROXY_BASE,
  SubscriberDetails,
  SubscriptionStatusResponse,
  isSubscribedStatus,
  parseSubscriptionStatus,
} from '../../shared/api';

class SubscriptionService {
  private subscribedCache: boolean | null = null;

  private getUrlParams(): URLSearchParams {
    return new URLSearchParams(window.location.search);
  }

  getParams(): APIParams {
    const urlParams = this.getUrlParams();
    const urlSubid = urlParams.get('subid');
    const sessionSubid = sessionStorage.getItem(SESSION_SUBID_KEY);
    const subid = urlSubid || sessionSubid || DEFAULT_SUBID;
    const productcode = urlParams.get('productcode') || DEFAULT_PRODUCTCODE;
    return { subid, productcode };
  }

  private normalizeSubid(subid?: string): string {
    const value = subid ?? this.getParams().subid;
    return value && value !== '' ? value : DEFAULT_SUBID;
  }

  private buildProxyUrl(endpoint: string, subid?: string): string {
    const { productcode } = this.getParams();
    const subscriberId = this.normalizeSubid(subid);
    return `${SUBSCRIPTION_PROXY_BASE}${endpoint}?subid=${encodeURIComponent(subscriberId)}&productcode=${encodeURIComponent(productcode)}`;
  }

  private buildCampaignUrl(subid?: string): string {
    const { productcode } = this.getParams();
    const subscriberId = this.normalizeSubid(subid);
    return `http://142.93.209.116/adpoke/cnt/act?subid=${encodeURIComponent(subscriberId)}&productcode=${encodeURIComponent(productcode)}`;
  }

  private isLocalDev(): boolean {
    const host = window.location.hostname;
    return host === 'localhost' || host === '127.0.0.1';
  }

  private isOnContentDomain(): boolean {
    try {
      return window.location.hostname === new URL(CONTENT_DOMAIN).hostname;
    } catch {
      return false;
    }
  }

  /** Active subscribed users land on portal domain with subid + productcode */
  redirectToContentDomain(subid: string, productcode: string): void {
    if (this.isLocalDev()) {
      const params = new URLSearchParams({ subid, productcode });
      const path = window.location.pathname.startsWith('/ar') ? '/ar/content/url' : '/content/url';
      window.location.href = `${path}?${params.toString()}`;
      return;
    }

    const url = new URL(`${CONTENT_DOMAIN}${CONTENT_PORTAL_PATH}`);
    url.searchParams.set('subid', subid);
    url.searchParams.set('productcode', productcode);
    window.location.href = url.toString();
  }

  persistSubid(subid: string): void {
    sessionStorage.setItem(SESSION_SUBID_KEY, subid);
    const params = new URLSearchParams(window.location.search);
    params.set('subid', subid);
    if (!params.get('productcode')) {
      params.set('productcode', this.getParams().productcode);
    }
    window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    this.subscribedCache = true;
  }

  private isPortalEntryPath(): boolean {
    return window.location.pathname.includes('/content/url');
  }

  /** Active user: redirect to portal domain/path, or grant access if already there */
  handleActiveSubscription(subid: string, productcode: string): 'redirected' | 'granted' {
    this.persistSubid(subid);

    const needsPortalRedirect =
      (!this.isOnContentDomain() && !this.isLocalDev()) ||
      ((this.isOnContentDomain() || this.isLocalDev()) && !this.isPortalEntryPath());

    if (needsPortalRedirect) {
      this.redirectToContentDomain(subid, productcode);
      return 'redirected';
    }

    return 'granted';
  }

  isSubscribedCached(): boolean {
    return this.subscribedCache === true;
  }

  /** Status check on every content page load */
  async initContentPage(): Promise<{ subscribed: boolean; redirected: boolean }> {
    const { subid, productcode } = this.getParams();
    if (!subid || subid === DEFAULT_SUBID) {
      return { subscribed: false, redirected: false };
    }

    try {
      const result = await this.checkStatus(subid);

      if (result.status === 1) {
        const outcome = this.handleActiveSubscription(subid, productcode);
        return { subscribed: true, redirected: outcome === 'redirected' };
      }

      window.location.href = this.getCampaignUrl(subid);
      return { subscribed: false, redirected: true };
    } catch (error) {
      console.error('❌ Content page status check failed:', error);
      return { subscribed: false, redirected: false };
    }
  }

  async checkStatus(subid?: string): Promise<SubscriptionStatusResponse> {
    const url = this.buildProxyUrl('/status', subid);
    console.log('📡 Status API Call:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const parsed = parseSubscriptionStatus(data);
    console.log('✅ Status API Response:', data, '→', parsed);
    return { status: parsed };
  }

  async checkStatusWithPhone(phoneNumber: string): Promise<SubscriptionStatusResponse> {
    return this.checkStatus(phoneNumber);
  }

  async hasActiveSubscription(): Promise<boolean> {
    if (this.subscribedCache === true) {
      return true;
    }

    const { subid } = this.getParams();
    if (!subid || subid === DEFAULT_SUBID) {
      return false;
    }

    try {
      const result = await this.checkStatus(subid);
      if (result.status === 1) {
        this.subscribedCache = true;
        return true;
      }
    } catch (error) {
      console.error('❌ Subscription check failed:', error);
    }

    return false;
  }

  async getSubscriberDetails(): Promise<SubscriberDetails> {
    const url = this.buildProxyUrl('/detail');
    console.log('📡 Details API Call:', url);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Details API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Details API Error:', error);
      return {
        msisdn: 'N/A',
        valid_from: new Date().toISOString(),
        valid_to: new Date().toISOString(),
        status: '0',
        service_name: 'Gamers Paradise',
      };
    }
  }

  getCampaignUrl(subid?: string): string {
    const url = this.buildCampaignUrl(subid);
    console.log('🚀 Campaign URL:', url);
    return url;
  }

  getCampaignUrlForPhone(phoneNumber: string): string {
    return this.getCampaignUrl(phoneNumber);
  }

  redirectToCampaign(subid?: string): void {
    window.location.href = this.getCampaignUrl(subid);
  }

  async unsubscribe(): Promise<void> {
    const url = this.buildProxyUrl('/deactivate');
    console.log('📡 Unsubscribe API Call:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    console.log('✅ Unsubscribe API Response Status:', response.status);
    this.subscribedCache = false;
    sessionStorage.removeItem(SESSION_SUBID_KEY);
  }

  isAccountSubscribed(details: SubscriberDetails): boolean {
    return isSubscribedStatus(details.status);
  }
}

export const subscriptionService = new SubscriptionService();
