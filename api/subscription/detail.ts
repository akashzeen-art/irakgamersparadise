import { DEFAULT_PRODUCTCODE, DEFAULT_SUBID, SUBSCRIPTION_API_BASE } from '../../shared/api';

export default async function handler(
  req: { query: Record<string, string | string[] | undefined> },
  res: { status: (code: number) => { json: (body: unknown) => void }; setHeader: (name: string, value: string) => void },
) {
  const subid = String(req.query.subid ?? DEFAULT_SUBID);
  const productcode = String(req.query.productcode ?? DEFAULT_PRODUCTCODE);
  const url = `${SUBSCRIPTION_API_BASE}/sub/detail?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    let data: unknown = {
      msisdn: 'N/A',
      valid_from: '',
      valid_to: '',
      status: '0',
      service_name: 'Gamers Paradise',
    };
    try {
      data = text ? JSON.parse(text) : data;
    } catch {
      data = { status: '0', raw: text };
    }
    res.setHeader('Cache-Control', 'no-store');
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    console.error('Detail proxy error:', error);
    res.status(502).json({
      msisdn: 'N/A',
      valid_from: '',
      valid_to: '',
      status: '0',
      service_name: 'Gamers Paradise',
    });
  }
}
