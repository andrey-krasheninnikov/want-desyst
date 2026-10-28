import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import { BrandLockup, MediaCard, ContactCard } from '../packages/react/src/index';

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
