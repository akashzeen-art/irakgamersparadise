import { RequestHandler } from 'express';
import { DEFAULT_PRODUCTCODE, DEFAULT_SUBID, SUBSCRIPTION_API_BASE } from '../../shared/api';

async function fetchSubscriptionApi(path: string, query: string) {
  const url = `${SUBSCRIPTION_API_BASE}${path}?${query}`;
  console.log('📡 Proxy subscription request:', url);

  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });

  const text = await response.text();
  let data: unknown = { status: 0 };
  try {
    data = text ? JSON.parse(text) : { status: 0 };
  } catch {
    data = { status: 0, raw: text };
  }

  return { ok: response.ok, status: response.status, data };
}

export const handleStatusCheck: RequestHandler = async (req, res) => {
  const subid = String(req.query.subid ?? DEFAULT_SUBID);
  const productcode = String(req.query.productcode ?? DEFAULT_PRODUCTCODE);

  try {
    const result = await fetchSubscriptionApi(
      '/sub/status',
      `subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`,
    );
    res.status(result.ok ? 200 : result.status).json(result.data);
  } catch (error) {
    console.error('❌ Status proxy error:', error);
    res.status(502).json({ status: 0, error: 'Status API unavailable' });
  }
};

export const handleSubscriberDetails: RequestHandler = async (req, res) => {
  const subid = String(req.query.subid ?? '');
  const msisdn = String(req.query.msisdn ?? '');
  const productcode = String(req.query.productcode ?? DEFAULT_PRODUCTCODE);
  const lookup = msisdn
    ? `msisdn=${encodeURIComponent(msisdn)}&productcode=${encodeURIComponent(productcode)}`
    : `subid=${encodeURIComponent(subid || DEFAULT_SUBID)}&productcode=${encodeURIComponent(productcode)}`;

  try {
    const result = await fetchSubscriptionApi('/sub/detail', lookup);
    res.status(result.ok ? 200 : result.status).json(result.data);
  } catch (error) {
    console.error('❌ Details proxy error:', error);
    res.status(502).json({
      msisdn: 'N/A',
      valid_from: '',
      valid_to: '',
      status: '0',
      service_name: 'Gamers Paradise',
    });
  }
};

export const handleDeactivate: RequestHandler = async (req, res) => {
  const subid = String(req.query.subid ?? DEFAULT_SUBID);
  const productcode = String(req.query.productcode ?? DEFAULT_PRODUCTCODE);

  try {
    const result = await fetchSubscriptionApi(
      '/dct',
      `subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`,
    );
    res.status(result.ok ? 200 : result.status).json(result.data ?? { success: result.ok });
  } catch (error) {
    console.error('❌ Deactivate proxy error:', error);
    res.status(502).json({ error: 'Deactivation API unavailable' });
  }
};
