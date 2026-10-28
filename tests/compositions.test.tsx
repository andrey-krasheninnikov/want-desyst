import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { BrandLockup, MediaCard, ContactCard, CommentFeed } from '../packages/react/src/index';

test('a product supplies its own brand and destination', () => {
  const html = renderToStaticMarkup(<BrandLockup name="Example Product" logoSrc="/example.svg" href="/example" />);
  expect(html).toContain('aria-label="Example Product"');
  expect(html).toContain('href="/example"');
  expect(html).not.toContain('Want Wallpapers');
});

test('media titles are text and images keep their dimensions', () => {
  const html = renderToStaticMarkup(<MediaCard href="/work" title="<script>bad()</script>" image={{ src: '/fixture.svg', width: 1600, height: 900, alt: 'Example artwork' }} />);
  expect(html).toContain('&lt;script&gt;');
  expect(html).toContain('width="1600"');
  expect(html).toContain('height="900"');
});

test('contact email remains a native same-tab link', () => {
  const html = renderToStaticMarkup(<ContactCard name="Example Owner" actions={[{ title: 'Email', detail: 'hello@example.com', href: 'mailto:hello@example.com' }]} />);
  expect(html).toContain('href="mailto:hello@example.com"');
  expect(html).not.toContain('target="_blank"');
});

test('comment dates preserve consumer-prepared text during SSR', () => {
  const html = renderToStaticMarkup(<CommentFeed comments={[{ id: 'sample', author: 'Guest', text: 'Example', createdAt: { dateTime: '2026-10-13T00:00:00.000Z', label: '13 October 2026' } }]} labels={{ title: 'Comments', empty: 'Empty', previous: 'Previous', next: 'Next', readMore: 'Read', collapse: 'Collapse' }} onAction={() => {}} />);
  expect(html).toContain('dateTime="2026-10-13T00:00:00.000Z"');
  expect(html).toContain('>13 October 2026</time>');
});
