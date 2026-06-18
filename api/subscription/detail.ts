const SUBSCRIPTION_API_BASE = 'http://142.93.209.116/adpoke/cnt';
const DEFAULT_SUBID = '0';
const DEFAULT_PRODUCTCODE = 'ZIQGP';

export default async function handler(
  req: { query: Record<string, string | string[] | undefined> },
  res: { status: (code: number) => { json: (body: unknown) => void }; setHeader: (name: string, value: string) => void },
) {
  const subid = String(req.query.subid ?? '');
  const msisdn = String(req.query.msisdn ?? '');
  const productcode = String(req.query.productcode ?? DEFAULT_PRODUCTCODE);
  const lookup = msisdn
    ? `msisdn=${encodeURIComponent(msisdn)}`
    : `subid=${encodeURIComponent(subid || DEFAULT_SUBID)}`;
  const url = `${SUBSCRIPTION_API_BASE}/sub/detail?${lookup}&productcode=${encodeURIComponent(productcode)}`;

  const fallback = {
    msisdn: 'N/A',
    valid_from: '',
    valid_to: '',
    status: '0',
    service_name: 'Arabic Gamers Paradise',
  };

  try {
    const response = await fetch(url);
    const text = await response.text();
    let data: unknown = fallback;
    try {
      data = text ? JSON.parse(text) : fallback;
    } catch {
      data = fallback;
    }
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(data);
  } catch (error) {
    console.error('Detail proxy error:', error);
    res.status(200).json(fallback);
  }
}
