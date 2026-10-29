export function initBackgroundMotion({ background, control, storageKey = 'want-background-motion', shimmerDelayMs = [8000, 18000] }: {
  background: HTMLElement; control: HTMLButtonElement; storageKey?: string; shimmerDelayMs?: readonly [number, number];
}) {
  const [minimum, maximum] = shimmerDelayMs;
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || minimum < 0 || maximum < minimum || maximum > 2147483647) {
    throw new RangeError('shimmerDelayMs must contain ordered finite delays between 0 and 2147483647 ms');
  }
  const root = document.documentElement;
  const sphere = background?.firstElementChild;
  if (!sphere) return () => {};

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const forced = window.matchMedia('(forced-colors: active)');
  let paused = false, disposed = false, height = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try { paused = localStorage.getItem(storageKey) === 'paused'; } catch {}
  const stop = () => { clearTimeout(timer); timer = undefined; };
  const shimmer = () => {
    if (disposed || root.dataset.backgroundMotion !== 'running') return;
    stop();
    background.dataset.backgroundShimmer = '';
    const wave = sphere.getAnimations({ subtree: true }).find(item => (item as CSSAnimation).animationName === 'want-gradient-shimmer');
    if (wave) wave.currentTime = 0;
  };
  const schedule = () => {
    stop();
    if (!disposed && root.dataset.backgroundMotion === 'running' && !background.hasAttribute('data-background-shimmer')) {
      timer = setTimeout(shimmer, minimum + Math.random() * (maximum - minimum));
    }
  };
  const resize = () => {
    if (disposed || height === background.clientHeight) return;
    height = background.clientHeight;
    const animation = sphere.getAnimations().find(item => (item as CSSAnimation).animationName === 'want-gradient-sphere');
    const duration = animation?.effect?.getComputedTiming().duration;
    const progress = animation && typeof animation.currentTime === 'number' && typeof duration === 'number' && duration > 0
      ? animation.currentTime / duration : null;
    const seconds = Math.max(28, height / 30);
    background.style.setProperty('--background-center-y', `${height / 2}px`);
    background.style.setProperty('--background-travel-y', `${height * .45}px`);
    background.style.setProperty('--background-duration', `${seconds}s`);
    sphere.getAnimations();
    if (animation && progress !== null) animation.currentTime = progress * seconds * 1000;
  };
  const observer = new ResizeObserver(resize);
  const update = () => {
    if (disposed) return;
    const allowed = !reduced.matches && !forced.matches;
    root.dataset.backgroundMotion = allowed && !paused && !document.hidden ? 'running' : 'paused';
    control.hidden = !allowed;
    control.textContent = paused ? control.dataset.playLabel! : control.dataset.pauseLabel!;
    if (!allowed) background.removeAttribute('data-background-shimmer');
    schedule();
  };
  const finish = (event: AnimationEvent) => {
    if (event.animationName !== 'want-gradient-shimmer') return;
    background.removeAttribute('data-background-shimmer');
    schedule();
  };
  const toggle = () => {
    paused = !paused;
    try { localStorage.setItem(storageKey, paused ? 'paused' : 'running'); } catch {}
    update();
  };
  control.addEventListener('click', toggle);
  background.addEventListener('animationend', finish);
  background.addEventListener('want:background-shimmer', shimmer);
  document.addEventListener('visibilitychange', update);
  reduced.addEventListener('change', update);
  forced.addEventListener('change', update);
  resize();
  observer.observe(background);
  update();
  return () => {
    if (disposed) return;
    disposed = true;
    stop();
    root.dataset.backgroundMotion = 'paused';
    background.removeAttribute('data-background-shimmer');
    control.hidden = true;
    observer.disconnect();
    control.removeEventListener('click', toggle);
    background.removeEventListener('animationend', finish);
    background.removeEventListener('want:background-shimmer', shimmer);
    document.removeEventListener('visibilitychange', update);
    reduced.removeEventListener('change', update);
    forced.removeEventListener('change', update);
  };
}
