import { useState } from 'react';
import { AnimatedText, Button, Glow, Loader, Prose, Shimmer, Snackbar, SnackbarProvider, SnackbarViewport, Typography, type SnackbarVariant } from '@want-foundation/desyst-react';
import { Section } from './Section';

const typeExamples = [
  ['display', 'Display'], ['h1', 'Heading 1'], ['h2', 'Heading 2'], ['h3', 'Heading 3'],
  ['h4', 'Heading 4'], ['h5', 'Heading 5'], ['h6', 'Heading 6'],
  ['lead', 'A clear introduction.'], ['body', 'Readable body text.'], ['small', 'Supporting details.'],
  ['caption', 'Image caption and metadata.'], ['label', 'Field label'], ['overline', 'Section label'],
  ['mono', 'index: 01 / 24'], ['code', 'const theme = "dark";'], ['code-block', 'const ready = true;\nrender(ready);'],
  ['quote', 'Clear words, steady rhythm.'],
] as const;

export function DemoTypography() {
  return <div className="demo-type-system" data-typography-demo>
    {typeExamples.map(([variant, text]) => <div className="demo-type-row" key={variant}>
      <code className="demo-type-name">{variant}</code>
      <Typography variant={variant} as="div" tone={variant === 'caption' ? 'muted' : 'default'}>{text}</Typography>
    </div>)}
    <div className="demo-type-locales"><Typography variant="body" lang="ja">読みやすい文字と余白。</Typography><Typography variant="body" lang="ar" dir="rtl">نص واضح ومقروء للجميع.</Typography></div>
    <details className="demo-prose"><summary>Show prose styles</summary><Prose><h3>Reading text</h3><p>Use <strong>strong emphasis</strong>, <em>gentle emphasis</em> and <code>inline code</code> in a readable measure.</p><ul><li>Lists keep their native semantics.</li><li><a href="#components">Links retain keyboard focus.</a></li></ul><blockquote>Words and spacing carry the hierarchy.</blockquote><pre><code>{'const theme = "dark";\nrender(theme);'}</code></pre></Prose></details>
  </div>;
}

function DemoLoaders() {
  const [paused, setPaused] = useState(false);
  return <Section title="Custom loaders"><div className="demo-stack">
    <Button variant="secondary" onClick={() => setPaused(value => !value)}>{paused ? 'Resume loaders' : 'Pause loaders'}</Button>
    <div className="demo-loader-grid">{(['spinner', 'dots', 'bars', 'orbit'] as const).map(variant => <div className="demo-loader-cell" key={variant}><Loader label={'Loading with ' + variant} variant={variant} size="lg" paused={paused} /><Typography variant="caption">{variant}</Typography></div>)}</div>
    <div className="demo-actions"><Loader label="Small loading indicator" size="sm" paused={paused} /><Loader label="Medium loading indicator" paused={paused} /><Loader label="Large loading indicator" size="lg" paused={paused} /></div>
  </div></Section>;
}

function DemoShimmers() {
  const [paused, setPaused] = useState(false);
  return <Section title="Shimmer placeholders"><div className="demo-stack">
    <Button variant="secondary" onClick={() => setPaused(value => !value)}>{paused ? 'Resume shimmer' : 'Pause shimmer'}</Button>
    <div className="demo-shimmer-grid">{(['avatar', 'text', 'block', 'card'] as const).map(variant => <div className="demo-stack" key={variant}><Typography variant="caption">{variant}</Typography><Shimmer label={'Loading ' + variant + ' preview'} variant={variant} paused={paused} /></div>)}</div>
  </div></Section>;
}

function DemoAnimatedText() {
  const [index, setIndex] = useState(0);
  const messages = ['Ready to explore', 'Preparing the preview', 'Everything is up to date'];
  return <Section title="Animated text"><div className="demo-stack">
    {(['fade', 'slide', 'blur'] as const).map(effect => <div key={effect}><Typography variant="caption" tone="muted">{effect}</Typography><Typography variant="lead"><AnimatedText text={messages[index]!} effect={effect} aria-live={effect === 'slide' ? 'polite' : 'off'} aria-atomic="true" /></Typography></div>)}
    <Button variant="secondary" onClick={() => setIndex(value => (value + 1) % messages.length)}>Change example text</Button>
  </div></Section>;
}

function DemoGlow() {
  const [paused, setPaused] = useState(false);
  const [result, setResult] = useState('');
  return <Section title="Reusable background glow"><div className="demo-stack">
    <Button variant="secondary" onClick={() => setPaused(value => !value)}>{paused ? 'Resume glow' : 'Pause glow'}</Button>
    <div className="glow-host demo-glow-surface"><Glow paused={paused} /><Typography variant="h3" as="h3">A soft background</Typography><Typography>Place the decorative layer behind any bounded surface.</Typography></div>
    <div className="demo-glow-cta-space"><span className="glow-host demo-glow-cta"><Glow paused={paused} /><Button onClick={() => setResult('CTA activated locally.')}>Glowing CTA</Button></span></div>
    <p className="demo-status" role="status">{result}</p>
  </div></Section>;
}

const notifications = {
  error: { label: 'Error', title: 'Could not save', description: 'The local example remains unchanged.', action: 'Retry', altText: 'Retry saving the local example' },
  warning: { label: 'Warning', title: 'Review required', description: 'Check the example fields before continuing.', action: 'Review', altText: 'Review the local example fields' },
  info: { label: 'Info', title: 'Preview available', description: 'This notification is a local example.', action: 'Open preview', altText: 'Open the local example preview' },
  success: { label: 'Success', title: 'Changes saved', description: 'Your local example is ready.', action: 'Undo', altText: 'Undo the local example change' },
} as const;

function DemoSnackbars() {
  const [variant, setVariant] = useState<SnackbarVariant>('info');
  const [open, setOpen] = useState(false);
  const [sequence, setSequence] = useState(0);
  const [result, setResult] = useState('');
  const copy = notifications[variant];
  return <Section title="Semantic snackbars"><SnackbarProvider label="Notification"><div className="demo-stack">
    <div className="demo-actions">{(['error', 'warning', 'info', 'success'] as const).map(kind => <Button key={kind} variant="secondary" onClick={() => { setVariant(kind); setSequence(value => value + 1); setOpen(true); }}>Show {kind} snackbar</Button>)}</div>
    <Typography variant="small" tone="muted">Four semantic colors and icons. Errors stay visible until dismissed. Hover or focus pauses timed messages.</Typography>
    <p className="demo-status" role="status">{result}</p>
    <Snackbar key={sequence} variant={variant} variantLabel={copy.label} title={copy.title} description={copy.description} open={open} onOpenChange={setOpen} closeLabel="Dismiss status message"
      action={{ label: copy.action, altText: copy.altText, onClick: () => setResult(copy.action + ' selected locally.') }} />
    <SnackbarViewport className="demo-snackbar-viewport" label="Status messages ({hotkey})" />
  </div></SnackbarProvider></Section>;
}

export function VisualDemos() {
  return <><DemoLoaders /><DemoShimmers /><DemoAnimatedText /><DemoGlow /><DemoSnackbars /></>;
}
