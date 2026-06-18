import {
  APIParams,
  CONTENT_DOMAIN,
  CONTENT_PORTAL_PATH,
  DEFAULT_PRODUCTCODE,
  DEFAULT_SUBID,
  SERVICE_NAME,
  SESSION_SUBID_KEY,
  SUBSCRIPTION_PROXY_BASE,
  SUBSCRIPTION_API_BASE,
  SubscriberDetails,
  SubscriptionStatusResponse,
  isSubscribedStatus,
  parseSubscriptionStatus,
  formatPhoneForSubid,
  formatMsisdn,
  looksLikeMsisdn,
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

  hasValidSubid(subid?: string): boolean {
    const value = this.normalizeSubid(subid);
    return value !== DEFAULT_SUBID && value !== '';
  }

  private buildDetailUrl(mode: 'subid' | 'msisdn', value: string): { proxy: string; direct: string } {
    const { productcode } = this.getParams();
    const param = mode === 'msisdn' ? 'msisdn' : 'subid';
    const query = `${param}=${encodeURIComponent(value)}&productcode=${encodeURIComponent(productcode)}`;
    return {
      proxy: `${SUBSCRIPTION_PROXY_BASE}/detail?${query}`,
      direct: `${SUBSCRIPTION_API_BASE}/sub/detail?${query}`,
    };
  }

  private async fetchDetailByKey(value: string, mode: 'subid' | 'msisdn'): Promise<SubscriberDetails | null> {
    const urls = this.buildDetailUrl(mode, value);

    for (const { label, url } of [
      { label: 'proxy', url: urls.proxy },
    ]) {
      try {
        console.log(`📡 Detail API (${label}, ${mode}):`, url);
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          console.warn(`Detail API HTTP ${response.status}:`, url);
          continue;
        }

        const data = await response.json();
        if (data?.msisdn != null) {
          return data;
        }
        console.warn('Detail API empty msisdn:', data);
      } catch (error) {
        console.warn('Detail API fetch failed:', url, error);
      }
    }

    return null;
  }

  private buildProxyUrl(endpoint: string, subid?: string): string {
    const { productcode } = this.getParams();
    const subscriberId = this.normalizeSubid(subid);
    return `${SUBSCRIPTION_PROXY_BASE}${endpoint}?subid=${encodeURIComponent(subscriberId)}&productcode=${encodeURIComponent(productcode)}`;
  }

  private buildDirectApiUrl(path: string, subid?: string): string {
    const { productcode } = this.getParams();
    const subscriberId = this.normalizeSubid(subid);
    return `${SUBSCRIPTION_API_BASE}${path}?subid=${encodeURIComponent(subscriberId)}&productcode=${encodeURIComponent(productcode)}`;
  }

  private async fetchSubscriptionStatus(subid?: string): Promise<SubscriptionStatusResponse> {
    const urls = [
      this.buildProxyUrl('/status', subid),
      this.buildDirectApiUrl('/sub/status', subid),
    ];

    for (const url of urls) {
      try {
        console.log('📡 Status API Call:', url);
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          console.warn('Status API HTTP error:', response.status, url);
          continue;
        }

        const data = await response.json();
        const parsed = parseSubscriptionStatus(data);
        console.log('✅ Status API Response:', data, '→', parsed);
        if (parsed === 1) {
          return { status: 1 };
        }
      } catch (error) {
        console.warn('Status API fetch failed:', url, error);
      }
    }

    if (this.hasValidSubid(subid)) {
      const subscriberId = this.normalizeSubid(subid);
      const details = await this.fetchDetailByKey(subscriberId, 'subid');
      if (details?.status != null) {
        const detailStatus = parseSubscriptionStatus({ status: details.status });
        console.log('✅ Detail API fallback (subid):', details, '→', detailStatus);
        return { status: detailStatus };
      }

      const msisdn = formatMsisdn(subscriberId);
      if (looksLikeMsisdn(subscriberId)) {
        const byMsisdn = await this.fetchDetailByKey(msisdn, 'msisdn');
        if (byMsisdn?.status != null) {
          const detailStatus = parseSubscriptionStatus({ status: byMsisdn.status });
          console.log('✅ Detail API fallback (msisdn):', byMsisdn, '→', detailStatus);
          return { status: detailStatus };
        }
      }
    }

    return { status: 0 };
  }

  private async fetchSubscriptionJson<T>(
    proxyEndpoint: string,
    apiPath: string,
    fallback: T,
    subid?: string,
  ): Promise<T> {
    const urls = [
      { label: 'proxy', url: this.buildProxyUrl(proxyEndpoint, subid) },
      { label: 'direct', url: this.buildDirectApiUrl(apiPath, subid) },
    ];

    for (const { label, url } of urls) {
      try {
        console.log(`📡 Subscription API (${label}):`, url);
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          console.warn(`Subscription API HTTP ${response.status}:`, url);
          continue;
        }

        const data = await response.json();
        if (proxyEndpoint === '/detail' && (!data || data.msisdn == null)) {
          console.warn('Subscriber detail empty for subid:', this.getParams().subid);
          return fallback;
        }

        return data;
      } catch (error) {
        console.warn('Subscription API fetch failed:', url, error);
      }
    }

    return fallback;
  }

  private buildCampaignUrl(subid?: string): string {
    const { productcode } = this.getParams();
    const subscriberId = this.normalizeSubid(subid);
    return `${SUBSCRIPTION_API_BASE}/act?subid=${encodeURIComponent(subscriberId)}&productcode=${encodeURIComponent(productcode)}`;
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

  /** Active subscribed users land on portal URL with subid + productcode */
  redirectToContentDomain(subid: string, productcode: string): void {
    const isArabic = window.location.pathname.startsWith('/ar');
    const portalPath = isArabic ? `/ar${CONTENT_PORTAL_PATH}` : CONTENT_PORTAL_PATH;
    const params = new URLSearchParams({ subid, productcode });
    const base = this.isLocalDev() ? '' : CONTENT_DOMAIN;
    window.location.href = `${base}${portalPath}?${params.toString()}`;
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
    const path = window.location.pathname;
    return path.includes(CONTENT_PORTAL_PATH) || path.includes('/content/url');
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
      window.location.href = this.getCampaignUrl(subid);
      return { subscribed: false, redirected: true };
    }
  }

  async checkStatus(subid?: string): Promise<SubscriptionStatusResponse> {
    return this.fetchSubscriptionStatus(subid);
  }

  async checkStatusWithPhone(phoneNumber: string): Promise<SubscriptionStatusResponse> {
    const msisdn = formatMsisdn(phoneNumber);
    console.log('📱 Phone subscription check for msisdn:', msisdn);

    const details = await this.fetchDetailByKey(msisdn, 'msisdn');

    if (details?.status != null && details.msisdn != null) {
      const status = parseSubscriptionStatus({ status: details.status });
      console.log('✅ Phone check via detail/msisdn:', details, '→', status);
      return { status };
    }

    console.warn('❌ Phone check failed — no active subscription for:', msisdn);
    return { status: 0 };
  }

  grantGameAccess(msisdn: string, productcode: string): void {
    this.persistSubid(msisdn);
    this.subscribedCache = true;
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
      if (looksLikeMsisdn(subid)) {
        const details = await this.fetchDetailByKey(formatMsisdn(subid), 'msisdn');
        if (details && parseSubscriptionStatus({ status: details.status }) === 1) {
          this.subscribedCache = true;
          return true;
        }
        return false;
      }

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

  async getSubscriberDetails(): Promise<SubscriberDetails | null> {
    const { subid } = this.getParams();

    if (this.hasValidSubid(subid)) {
      const bySubid = await this.fetchDetailByKey(subid, 'subid');
      if (bySubid?.msisdn) {
        return bySubid;
      }

      const msisdnFromSubid = formatMsisdn(subid);
      if (looksLikeMsisdn(subid)) {
        const byMsisdn = await this.fetchDetailByKey(msisdnFromSubid, 'msisdn');
        if (byMsisdn?.msisdn) {
          return byMsisdn;
        }
      }
    }

    console.warn('Subscriber detail skipped: missing subid in URL or session');
    return null;
  }

  getCampaignUrl(subid?: string): string {
    const url = this.buildCampaignUrl(subid);
    console.log('🚀 Campaign URL:', url);
    return url;
  }

  getCampaignUrlForPhone(phoneNumber: string): string {
    return this.getCampaignUrl(formatMsisdn(phoneNumber));
  }

  redirectToCampaign(subid?: string): void {
    window.location.href = this.getCampaignUrl(subid);
  }

  async unsubscribe(): Promise<void> {
    await this.fetchSubscriptionJson('/deactivate', '/dct', { success: false });
    this.subscribedCache = false;
    sessionStorage.removeItem(SESSION_SUBID_KEY);
  }

  logout(): void {
    this.subscribedCache = false;
    sessionStorage.removeItem(SESSION_SUBID_KEY);
    const isArabic = window.location.pathname.startsWith('/ar');
    window.location.href = isArabic ? '/ar' : '/';
  }

  isAccountSubscribed(details: SubscriberDetails): boolean {
    return isSubscribedStatus(details.status);
  }
}

export const subscriptionService = new SubscriptionService();
