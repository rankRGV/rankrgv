import assert from 'node:assert/strict';
import test from 'node:test';
import { reportContactContext } from './report-contact.ts';

const scanId = '123e4567-e89b-12d3-a456-426614174000';

test('contact context accepts only a public UUID reference on the fixed grader origin', () => {
  const params = new URLSearchParams({ report: scanId, business: 'García & Sons', city: 'McAllen', service: 'roof repair', access: 'ignored' });
  const context = reportContactContext(`?${params}`)!;
  assert.equal(context.reportUrl, `https://grader.rankrgv.com/report/${scanId}`);
  assert.equal(context.business, 'García & Sons');
  assert.ok(context.message.includes('Search city: McAllen'));
  assert.ok(!context.message.includes('ignored'));
  assert.equal(reportContactContext('?report=https://evil.example/'), null);
  assert.equal(reportContactContext('?report=unsaved'), null);
  assert.equal(reportContactContext('?business=Somebody'), null);
});

test('user supplied report context is bounded and strips line-control input', () => {
  const params = new URLSearchParams({ report: scanId, business: 'a'.repeat(300), city: 'McAllen\nAnother city', service: 'repair\u0000' });
  const context = reportContactContext(params.toString())!;
  assert.equal(context.business.length, 200);
  assert.equal(context.city, 'McAllen Another city');
  assert.equal(context.service, 'repair');
});
