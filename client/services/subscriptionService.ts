import { SubscriptionStatusResponse, SubscriberDetails, APIParams } from '../../shared/api';

// Use HTTPS for production, HTTP for localhost
const getBaseUrl = () => {
  if (window.location.protocol === 'https:') {
    return 'https://142.93.209.116/adpoke/cnt';
  }
  return 'http://142.93.209.116/adpoke/cnt';
};

const PRODUCTCODE = 'ZIQGP';

class SubscriptionService {
  private getParams(): APIParams {
    const urlParams = new URLSearchParams(window.location.search);
    return {
      subid: urlParams.get('subid') || '0',
      productcode: urlParams.get('productcode') || PRODUCTCODE
    };
  }

  async checkStatus(): Promise<SubscriptionStatusResponse> {
    const { subid, productcode } = this.getParams();
    const url = `${getBaseUrl()}/sub/status?subid=${subid}&productcode=${productcode}`;
    console.log('📡 Status API Call:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Status API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Status API Error:', error);
      return { status: 0 };
    }
  }

  async checkStatusWithPhone(phoneNumber: string): Promise<SubscriptionStatusResponse> {
    const url = `${getBaseUrl()}/sub/status?subid=${phoneNumber}&productcode=${PRODUCTCODE}`;
    console.log('📡 Status API Call with Phone:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Status API Response:', data);
      return data;
    } catch (error) {
      console.error('❌ Status API Error:', error);
      throw error;
    }
  }

  async getSubscriberDetails(): Promise<SubscriberDetails> {
    const { subid, productcode } = this.getParams();
    const url = `${getBaseUrl()}/sub/detail?subid=${subid}&productcode=${productcode}`;
    console.log('📡 Details API Call:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
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
        service_name: 'Gamers Paradise'
      };
    }
  }

  getCampaignUrl(): string {
    const { subid, productcode } = this.getParams();
    const url = `${getBaseUrl()}/act?subid=${subid}&productcode=${productcode}`;
    console.log('🚀 Campaign URL:', url);
    return url;
  }

  getCampaignUrlForPhone(phoneNumber: string): string {
    const urlParams = new URLSearchParams(window.location.search);
    const productcode = urlParams.get('productcode') || PRODUCTCODE;
    const url = `${getBaseUrl()}/act?subid=${phoneNumber}&productcode=${productcode}`;
    console.log('🚀 Campaign URL for Phone:', url);
    return url;
  }

  getUnsubscribeUrl(): string {
    const { subid, productcode } = this.getParams();
    const url = `${getBaseUrl()}/dct?subid=${subid}&productcode=${productcode}`;
    console.log('🔗 Unsubscribe URL:', url);
    return url;
  }

  redirectToCampaign(): void {
    const url = this.getCampaignUrl();
    console.log('🔄 Redirecting to Campaign:', url);
    
    const confirmRedirect = confirm(
      'You will be redirected to the subscription page. Continue?'
    );
    
    if (confirmRedirect) {
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        window.location.href = url;
      }
    } else {
      console.log('🚫 User cancelled redirect');
    }
  }

  async unsubscribe(): Promise<void> {
    const { subid, productcode } = this.getParams();
    const url = `${getBaseUrl()}/dct?subid=${subid}&productcode=${productcode}`;
    console.log('📡 Unsubscribe API Call:', url);
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('✅ Unsubscribe API Response Status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Unsubscribe API Error:', error);
      throw error;
    }
  }

  testCampaignUrl(): void {
    const url = this.getCampaignUrl();
    console.log('🧪 Testing Campaign URL:', url);
    
    fetch(url, { method: 'HEAD' })
      .then(response => {
        console.log('📊 Campaign URL Test Result:', {
          status: response.status,
          ok: response.ok,
          headers: Object.fromEntries(response.headers.entries())
        });
      })
      .catch(error => {
        console.error('🚨 Campaign URL Test Error:', error);
      });
  }
}

export const subscriptionService = new SubscriptionService();