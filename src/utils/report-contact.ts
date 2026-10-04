/** Only a public scan reference is accepted; report access credentials never enter this form. */
export function reportContactContext(search: string) {
  const params = new URLSearchParams(search);
  const reportId = params.get('report') ?? '';
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(reportId)) return null;
  const clean = (key: string, limit: number) => (params.get(key) ?? '').replace(/[\r\n\x00-\x1f]/g, ' ').trim().slice(0, limit);
  const business = clean('business', 200);
  const city = clean('city', 100);
  const service = clean('service', 200);
  const reportUrl = `https://grader.rankrgv.com/report/${reportId}`;
  const message = [
    'I would like help choosing the next change from my Business Grader report.',
    business && `Business: ${business}`,
    service && `Search service: ${service}`,
    city && `Search city: ${city}`,
    `Saved report: ${reportUrl}`,
  ].filter(Boolean).join('\n');
  return { business, city, service, reportUrl, message };
}
