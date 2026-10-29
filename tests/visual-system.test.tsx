import { expect, test } from 'bun:test';
import { renderToStaticMarkup } from 'react-dom/server';
import tokens from '../packages/foundation/tokens.json';
import { themeCss } from '../scripts/theme-css';
import { AnimatedText, Glow, Loader, Prose, Shimmer, Typography } from '../packages/react/src/index';

function luminance(hex: string) {
  const rgb = [1, 3, 5].map(offset => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
  return rgb[0]! * .2126 + rgb[1]! * .7152 + rgb[2]! * .0722;
}
function contrast(first: string, second: string) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0]! + .05) / (values[1]! + .05);
}

test('feedback accents match the reference in both themes and keep text readable', () => {
  const reference = { primary: '#5962F0', success: '#7DF04A', info: '#28D7F5', warning: '#FFD43B', error: '#FF526D' };
  for (const mode of ['light', 'dark'] as const) {
    const palette = tokens.themes.wallpapers[mode];
    for (const [kind, color] of Object.entries(reference)) expect(palette[kind as keyof typeof palette]).toBe(color);
    for (const kind of ['error', 'warning', 'info', 'success'] as const) {
      expect(contrast(palette[kind + '-foreground' as keyof typeof palette], palette[kind + '-surface' as keyof typeof palette])).toBeGreaterThanOrEqual(4.5);
      expect(contrast(palette[kind + '-text' as keyof typeof palette], palette.background)).toBeGreaterThanOrEqual(4.5);
    }
    expect(contrast(palette['destructive-foreground'], palette.destructive)).toBeGreaterThanOrEqual(4.5);
  }
});

test('typography preserves semantic HTML and explicit element overrides', () => {
  expect(renderToStaticMarkup(<Typography variant="h2">Heading</Typography>)).toMatch(/^<h2/);
  expect(renderToStaticMarkup(<Typography variant="h1" as="h3">Heading</Typography>)).toMatch(/^<h3/);
  expect(renderToStaticMarkup(<Typography variant="code">{'<unsafe>'}</Typography>)).toContain('&lt;unsafe&gt;');
  expect(renderToStaticMarkup(<Prose><p>Reading</p></Prose>)).toContain('<p>Reading</p>');
  expect(Object.keys(tokens.typography.styles)).toHaveLength(17);
  expect(tokens.typography.styles.body.minPx).toBe(16);
  expect(tokens.typography.styles.caption.minPx).toBe(14);
});

test('type compilation keeps fluid sizes, locale font variables and semantic colors', () => {
  const css = themeCss();
  expect(css).toContain('--type-display-size:clamp(2rem');
  expect(css).toContain('--type-body-size:1rem');
  expect(css).toContain('font-family:var(--font-display)');
  expect(css).toContain('font-family:var(--font-sans)');
  expect(css).toContain('--success-surface:');
  expect(css).toContain('.ui-prose :where(h2)');
});

test('visual indicators render without browser APIs and preserve accessible labels', () => {
  for (const variant of ['spinner', 'dots', 'bars', 'orbit'] as const) {
    const html = renderToStaticMarkup(<Loader label="Loading preview" variant={variant} paused />);
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-label="Loading preview"');
    expect(html).toContain('data-paused="true"');
  }
  for (const variant of ['block', 'text', 'avatar', 'card'] as const) {
    expect(renderToStaticMarkup(<Shimmer label="Loading content" variant={variant} />)).toContain('aria-label="Loading content"');
  }
  expect(renderToStaticMarkup(<Glow paused />)).toContain('aria-hidden="true"');
  expect(renderToStaticMarkup(<AnimatedText text="<current>" effect="blur" />)).toContain('&lt;current&gt;');
});
