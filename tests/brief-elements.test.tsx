import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { DateField, isHttpUrl, UrlField, Window, type DateFieldLabels } from '../packages/react/src/index';

const labels: DateFieldLabels = {
  date: 'Choose date',
  datetime: 'Choose date and time',
  calendar: 'Calendar',
  previousYear: 'Previous year',
  previousMonth: 'Previous month',
  nextMonth: 'Next month',
  nextYear: 'Next year',
  hours: 'Hours',
  minutes: 'Minutes',
  today: 'Today',
  clear: 'Clear',
  apply: 'Apply',
};

test('window keeps its title and actions independent of product data', () => {
  const html = renderToStaticMarkup(<Window title="Overview" kicker="This week" actions={<button>Refresh</button>}><p>Work</p></Window>);
  expect(html).toContain('aria-labelledby=');
  expect(html).toContain('<h1');
  expect(html).toContain('Overview');
  expect(html).toContain('Refresh');
});

test('URL field links only to HTTP(S) destinations', () => {
  expect(isHttpUrl('https://example.com')).toBe(true);
  expect(isHttpUrl('http://example.com')).toBe(true);
  expect(isHttpUrl('javascript:alert(1)')).toBe(false);
  expect(isHttpUrl('//example.com')).toBe(false);
  const valid = renderToStaticMarkup(<UrlField label="Website" value="https://example.com" openLabel="Open website" onChange={() => {}} />);
  expect(valid).toContain('href="https://example.com"');
  expect(valid).toContain('rel="noopener noreferrer"');
  const invalid = renderToStaticMarkup(<UrlField label="Website" value="javascript:alert(1)" openLabel="Open website" onChange={() => {}} />);
  expect(invalid).not.toContain('data-slot="open-url"');
});

test('date field preserves a local date value in its public trigger', () => {
  const html = renderToStaticMarkup(<DateField mode="date" value="2026-10-28" labels={labels} locale="en-GB" onChange={() => {}} />);
  expect(html).toContain('28 Oct 2026');
  expect(html).toContain('aria-haspopup="dialog"');
});

test('date field keeps wall time unchanged across time zones', () => {
  const html = renderToStaticMarkup(<DateField mode="datetime" value="2026-03-29T02:30" today="2026-03-29T03:00" labels={labels} locale="en-GB" onChange={() => {}} />);
  expect(html).toContain('29 Mar 2026 at 02:30');
});
