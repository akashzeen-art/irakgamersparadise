import { useState } from 'react';
import { subscriptionService } from '../services/subscriptionService';

export function APITest() {
  const [statusResult, setStatusResult] = useState<any>(null);
  const [detailsResult, setDetailsResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testStatusAPI = async () => {
    setLoading(true);
    try {
      const result = await subscriptionService.checkStatus();
      setStatusResult(result);
      console.log('Status API Result:', result);
    } catch (error) {
      setStatusResult({ error: error.message });
      console.error('Status API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testDetailsAPI = async () => {
    setLoading(true);
    try {
      const result = await subscriptionService.getSubscriberDetails();
      setDetailsResult(result);
      console.log('Details API Result:', result);
    } catch (error) {
      setDetailsResult({ error: error.message });
      console.error('Details API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCampaignRedirect = () => {
    const url = subscriptionService.getCampaignUrl();
    console.log('Campaign URL:', url);
    alert(`Would redirect to: ${url}`);
  };

  const testCampaignURL = () => {
    const url = subscriptionService.getCampaignUrl();
    fetch(url, { method: 'HEAD' })
      .then((response) => {
        console.log('Campaign URL test:', { url, status: response.status, ok: response.ok });
        alert(`Campaign URL reachable: ${response.ok} (${response.status})`);
      })
      .catch((error) => {
        console.error('Campaign URL test error:', error);
        alert(`Campaign URL test failed: ${error.message}`);
      });
  };

  const testUnsubscribe = async () => {
    setLoading(true);
    try {
      await subscriptionService.unsubscribe();
      alert('Unsubscribe API called successfully');
    } catch (error) {
      alert(`Unsubscribe error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-slate-800 p-4 rounded-lg border border-neon-purple/20 z-50 max-w-sm">
      <h3 className="text-white font-bold mb-3">API Test Panel</h3>
      
      <div className="space-y-2">
        <button 
          onClick={testStatusAPI} 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 px-3 rounded disabled:opacity-50"
        >
          Test Status API
        </button>
        
        <button 
          onClick={testDetailsAPI} 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white text-sm py-2 px-3 rounded disabled:opacity-50"
        >
          Test Details API
        </button>
        
        <button 
          onClick={testCampaignRedirect}
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white text-sm py-2 px-3 rounded"
        >
          Test Campaign URL
        </button>
        
        <button 
          onClick={testCampaignURL}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-sm py-2 px-3 rounded"
        >
          Test Campaign Connection
        </button>
        
        <button 
          onClick={testUnsubscribe} 
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white text-sm py-2 px-3 rounded disabled:opacity-50"
        >
          Test Unsubscribe API
        </button>
      </div>

      {statusResult && (
        <div className="mt-3 p-2 bg-slate-700 rounded text-xs text-white">
          <strong>Status:</strong> {JSON.stringify(statusResult)}
        </div>
      )}
      
      {detailsResult && (
        <div className="mt-3 p-2 bg-slate-700 rounded text-xs text-white">
          <strong>Details:</strong> {JSON.stringify(detailsResult, null, 2)}
        </div>
      )}
      
      <div className="mt-3 text-xs text-white/60">
        URL Params: {window.location.search}
      </div>
    </div>
  );
}