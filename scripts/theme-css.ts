import tokens from '../packages/foundation/tokens.json';

export function themeCss(): string {
  const theme = tokens.themes.wallpapers;
  const values = (mode: 'light' | 'dark') => Object.entries(theme[mode]).map(([name, value]) => '--' + name + ':' + value + ';').join('') +
    'color-scheme:' + mode + ';--glass-highlight:' + tokens.glass.highlight[mode] + ';--glass-shadow:' + tokens.glass.shadow[mode] + ';';
  const fonts = (items: string[]) => items.map(item => item.includes(' ') ? JSON.stringify(item) : item).join(',');
  // Interpolate between 320 and 1440 px, with rem bounds for text zoom.
  const typeStyles = Object.entries(tokens.typography.styles).map(([name, style]) => {
    const slope = (style.maxPx - style.minPx) / 11.2;
    const base = (style.minPx - slope * 3.2) / 16;
    const size = style.minPx === style.maxPx ? style.minPx / 16 + 'rem'
      : 'clamp(' + style.minPx / 16 + 'rem, calc(' + base.toFixed(4) + 'rem + ' + slope.toFixed(4) + 'vw), ' + style.maxPx / 16 + 'rem)';
    return '--type-' + name + '-size:' + size + ';--type-' + name + '-weight:' + style.weight +
      ';--type-' + name + '-leading:' + style.lineHeight + ';--type-' + name + '-tracking:' + style.trackingEm + 'em;';
  }).join('');
  const proseElements: Record<string, string> = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6', body: 'p', small: 'small', caption: 'figcaption', label: 'label', code: ':not(pre) > code', 'code-block': 'pre', quote: 'blockquote' };
  const typeRules = Object.entries(tokens.typography.styles).map(([name, style]) => {
    const selectors = '.ui-typography[data-variant="' + name + '"]' + (proseElements[name] ? ',.ui-prose :where(' + proseElements[name] + ')' : '');
    const family = style.font === 'body' ? '--font-sans' : '--font-' + style.font;
    return selectors + '{font-family:var(' + family + ');font-size:var(--type-' + name + '-size);font-weight:var(--type-' + name +
      '-weight);line-height:var(--type-' + name + '-leading);letter-spacing:var(--type-' + name + '-tracking);}';
  }).join('');
  const shared = '--radius:' + tokens.geometry.fieldRadiusPx + 'px;--panel-radius:' + tokens.geometry.panelRadiusPx + 'px;--media-radius:' + tokens.geometry.mediaRadiusPx + 'px;' +
    '--glass-opacity:' + tokens.glass.opacityPercent + '%;--glass-blur:' + tokens.glass.blurPx + 'px;--glass-saturation:' + tokens.glass.saturationPercent + '%;' +
    '--motion-fast:' + tokens.motion.feedbackMs + 'ms;--motion-transition:' + tokens.motion.transitionMs + 'ms;--motion-glow:' + tokens.motion.glowMs + 'ms;--motion-ease:cubic-bezier(' + tokens.motion.easing.join(',') + ');' +
    '--want-font-japanese:' + fonts(tokens.typography.japanese) + ';--want-font-arabic:' + fonts(tokens.typography.arabic) + ';--want-font-display:' + fonts(tokens.typography.display) + ';--want-font-sans:' + fonts(tokens.typography.body) + ';--want-font-mono:' + fonts(tokens.typography.mono) + ';';
  return ':root{' + values('light') + shared + typeStyles + '}\n' +
    '@media(prefers-color-scheme:dark){:root:not([data-theme]){' + values('dark') + '}}\n' +
    ':root[data-theme="dark"],:root.dark{' + values('dark') + '}\n' +
    ':root[data-theme="light"]{' + values('light') + '}\n' + '@layer components{' + typeRules + '}\n';
}
