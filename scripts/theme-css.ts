import tokens from '../packages/foundation/tokens.json';

export function themeCss(): string {
  const theme = tokens.themes.wallpapers;
  const values = (mode: 'light' | 'dark') => Object.entries(theme[mode]).map(([name, value]) => '--' + name + ':' + value + ';').join('') +
    'color-scheme:' + mode + ';--glass-highlight:' + tokens.glass.highlight[mode] + ';--glass-shadow:' + tokens.glass.shadow[mode] + ';';
  const fonts = (items: string[]) => items.map(item => item.includes(' ') ? JSON.stringify(item) : item).join(',');
  const shared = '--radius:' + tokens.geometry.fieldRadiusPx + 'px;--panel-radius:' + tokens.geometry.panelRadiusPx + 'px;--media-radius:' + tokens.geometry.mediaRadiusPx + 'px;' +
    '--glass-opacity:' + tokens.glass.opacityPercent + '%;--glass-blur:' + tokens.glass.blurPx + 'px;--glass-saturation:' + tokens.glass.saturationPercent + '%;' +
    '--motion-fast:' + tokens.motion.feedbackMs + 'ms;--motion-transition:' + tokens.motion.transitionMs + 'ms;--motion-glow:' + tokens.motion.glowMs + 'ms;--motion-ease:cubic-bezier(' + tokens.motion.easing.join(',') + ');' +
    '--want-font-japanese:' + fonts(tokens.typography.japanese) + ';--want-font-arabic:' + fonts(tokens.typography.arabic) + ';--want-font-display:' + fonts(tokens.typography.display) + ';--want-font-sans:' + fonts(tokens.typography.body) + ';--want-font-mono:' + fonts(tokens.typography.mono) + ';';
  return ':root{' + values('light') + shared + '}\n' +
    '@media(prefers-color-scheme:dark){:root:not([data-theme]){' + values('dark') + '}}\n' +
    ':root[data-theme="dark"],:root.dark{' + values('dark') + '}\n' +
    ':root[data-theme="light"]{' + values('light') + '}\n';
}
