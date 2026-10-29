import { useEffect, useRef, useState } from 'react';
import { BrandLockup, Button, DirectionProvider, ThemeToggle } from '@want-foundation/desyst-react';
import { burstConfetti, initInteractionEffects, initBackgroundMotion } from '@want-foundation/desyst-foundation';
import UiKit from './UiKit';

export default function Showcase({ logo }: { logo: string }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');
  const explicitTheme = useRef<'light' | 'dark' | undefined>(undefined);
  const confetti = useRef<() => void>(() => {});
  function applyTheme(value: 'light' | 'dark') {
    setTheme(value); document.documentElement.dataset.theme = value;
    document.documentElement.classList.toggle('dark', value === 'dark');
  }
  useEffect(() => {
    try { const saved = localStorage.getItem('want-theme'); if (saved === 'light' || saved === 'dark') explicitTheme.current = saved; } catch {}
    const media = matchMedia('(prefers-color-scheme: dark)');
    const update = () => applyTheme(explicitTheme.current ?? (media.matches ? 'dark' : 'light'));
    media.addEventListener('change', update); update();
    const interactions = initInteractionEffects();
    const background = document.querySelector<HTMLElement>('.page-background')!;
    const control = document.querySelector<HTMLButtonElement>('[data-background-toggle]')!;
    const motion = initBackgroundMotion({ background, control, shimmerDelayMs: [5000, 10000] });
    return () => { interactions(); motion(); confetti.current(); media.removeEventListener('change', update); };
  }, []);
  function chooseTheme(value: 'light' | 'dark') {
    explicitTheme.current = value; applyTheme(value);
    try { localStorage.setItem('want-theme', value); } catch {}
  }
  return <DirectionProvider dir={direction}>
    <header className="showcase-header glass-surface">
      <BrandLockup name="Want Desyst" subtitle="Foundations & React" logoSrc={logo} href="#main" />
      <div className="showcase-controls">
        <Button variant="secondary" onClick={() => { const next = direction === 'ltr' ? 'rtl' : 'ltr'; setDirection(next); document.documentElement.dir = next; }}>Toggle RTL</Button>
        <ThemeToggle theme={theme} onThemeChange={chooseTheme} label="Dark theme" />
      </div>
    </header>
    <main id="main" className="showcase-main" tabIndex={-1}>
      <div className="showcase-intro"><p className="showcase-index">WANT / DESIGN SYSTEM / 0.1</p><h1>Shared by design.</h1><p>Tokens, accessible controls and product compositions. Local examples, ready for independent consumers.</p></div>
      <section className="kit-section showcase-motion"><h2>Optional motion</h2><p>The background and interaction effects have explicit ownership and cleanup. System accessibility preferences take priority.</p>
        <div className="showcase-controls"><Button variant="secondary" data-background-toggle data-pause-label="Pause background glow" data-play-label="Resume background glow" hidden>Pause background glow</Button>
        <Button variant="secondary" onClick={() => document.querySelector('.page-background')?.dispatchEvent(new Event('want:background-shimmer'))}>Preview background wave</Button>
        <Button onClick={event => { confetti.current(); confetti.current = burstConfetti(event.currentTarget); }}>Preview confetti</Button></div>
      </section>
      <div id="components"><UiKit item={{ href: '#main', title: 'Violet Horizon', caption: 'Local demonstration artwork', index: 1, image: { src: '/sample.svg', width: 1600, height: 900, alt: 'Violet ridge against a graphite background' } }} /></div>
      <section lang="ar" dir="rtl" className="kit-section locale-example"><h2>تصميم واضح للجميع</h2><p>مثال محلي للتحقق من اتجاه النص والخط العربي وإمكانية الوصول.</p></section>
    </main>
  </DirectionProvider>;
}
