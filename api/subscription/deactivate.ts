import { DEFAULT_PRODUCTCODE, DEFAULT_SUBID, SUBSCRIPTION_API_BASE } from '../../shared/api';

export default async function handler(
  req: { query: Record<string, string | string[] | undefined> },
  res: { status: (code: number) => { json: (body: unknown) => void }; setHeader: (name: string, value: string) => void },
) {
  const subid = String(req.query.subid ?? DEFAULT_SUBID);
  const productcode = String(req.query.productcode ?? DEFAULT_PRODUCTCODE);
  const url = `${SUBSCRIPTION_API_BASE}/dct?subid=${encodeURIComponent(subid)}&productcode=${encodeURIComponent(productcode)}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    let data: unknown = { success: response.ok };
    try {
      data = text ? JSON.parse(text) : data;
    } catch {
      data = { success: response.ok, raw: text };
    }
    res.setHeader('Cache-Control', 'no-store');
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (error) {
    console.error('Deactivate proxy error:', error);
    res.status(502).json({ error: 'Deactivation API unavailable' });
  }
}
