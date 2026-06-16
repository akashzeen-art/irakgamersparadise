import { SubscriptionStatusResponse, SubscriberDetails, APIParams } from '../../shared/api';

const BASE_URL = 'http://142.93.209.116/adpoke/cnt';

class SubscriptionService {
  private getParams(): APIParams {
    const urlParams = new URLSearchParams(window.location.search);
    const params = {
      subid: urlParams.get('subid') || '0',
      productcode: urlParams.get('productcode') || ''
    };
    console.log('🔗 URL Parameters:', params);
    return params;
  }

  async checkStatus(): Promise<SubscriptionStatusResponse> {
    const { subid, productcode } = this.getParams();
    const url = `${BASE_URL}/sub/status?subid=${subid}&productcode=${productcode}`;
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
      // Return default response for testing
      return { status: 0 };
    }
  }

  async getSubscriberDetails(): Promise<SubscriberDetails> {
    const { subid, productcode } = this.getParams();
    const url = `${BASE_URL}/sub/detail?subid=${subid}&productcode=${productcode}`;
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
      // Return mock data for testing
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
    const url = `${BASE_URL}/act?subid=${subid}&productcode=${productcode}`;
    console.log('🚀 Campaign URL:', url);
    return url;
  }

  getUnsubscribeUrl(): string {
    const { subid, productcode } = this.getParams();
    const url = `${BASE_URL}/dct?subid=${subid}&productcode=${productcode}`;
    console.log('🔗 Unsubscribe URL:', url);
    return url;
  }

  redirectToCampaign(): void {
    const url = this.getCampaignUrl();
    console.log('🔄 Redirecting to Campaign:', url);
    
    // Add warning before redirect
    const confirmRedirect = confirm(
      'You will be redirected to the subscription page. Continue?'
    );
    
    if (confirmRedirect) {
      // Try opening in new tab first
      const newWindow = window.open(url, '_blank');
      
      // If popup blocker prevents opening, redirect current window
      if (!newWindow) {
        window.location.href = url;
      }
    } else {
      console.log('🚫 User cancelled redirect');
    }
  }

  async unsubscribe(): Promise<void> {
    const { subid, productcode } = this.getParams();
    const url = `${BASE_URL}/dct?subid=${subid}&productcode=${productcode}`;
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

  // Method to test campaign URL without redirecting
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