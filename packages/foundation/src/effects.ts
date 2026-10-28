export function initInteractionEffects() {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const colors = matchMedia('(forced-colors: active)');
  let lastSpark = 0;
  let sparks = 0;
  const animations = new Map<HTMLElement, Animation>();
  const allowed = () => !motion.matches && pointer.matches && !colors.matches;
  function clearParticles() {
    for (const [particle, animation] of animations) { animation.cancel(); particle.remove(); }
    animations.clear();
  }
  const preferencesChanged = () => { if (!allowed()) clearParticles(); };
  const move = (event: PointerEvent) => {
    if (!allowed() || event.buttons || event.pointerType === 'touch') return;
    const target = event.target instanceof Element ? event.target : null;
    const control = target?.closest('a[href], button');
    if (!control || target?.closest('input, textarea, select, [contenteditable]:not([contenteditable="false"]), img, picture, video, audio, canvas, iframe, model-viewer, [inert], [aria-disabled="true"], :disabled') || window.getSelection()?.toString() || sparks >= 3 || performance.now() - lastSpark < 160) return;
    lastSpark = performance.now(); sparks++;
    const spark = document.createElement('span'); spark.className = 'wand-spark'; spark.setAttribute('aria-hidden', 'true');
    spark.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 20 15 9m-1-3 4 4M18 2v4m-2-2h4M6 5v4M4 7h4"/></svg>';
    spark.style.left = `${event.clientX + 8}px`; spark.style.top = `${event.clientY - 16}px`;
    document.body.append(spark);
    const animation = spark.animate([{ opacity: .45, transform: 'translateY(0) rotate(-8deg)' }, { opacity: 0, transform: 'translateY(-10px) rotate(8deg)' }], { duration: 450 });
    animations.set(spark, animation);
    void animation.finished.catch(() => {}).finally(() => { spark.remove(); animations.delete(spark); sparks--; });
  };
  document.addEventListener('pointermove', move, { passive: true });
  motion.addEventListener('change', preferencesChanged);
  pointer.addEventListener('change', preferencesChanged);
  colors.addEventListener('change', preferencesChanged);
  return () => {
    document.removeEventListener('pointermove', move);
    motion.removeEventListener('change', preferencesChanged);
    pointer.removeEventListener('change', preferencesChanged);
    colors.removeEventListener('change', preferencesChanged);
    clearParticles();
  };
}

export function burstConfetti(anchor: HTMLElement): () => void {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine)');
  const colors = matchMedia('(forced-colors: active)');
  if (motion.matches || !pointer.matches || colors.matches) return () => {};
  const particles = new Map<HTMLElement, Animation>();
  const cleanup = () => {
    for (const [particle, animation] of particles) { animation.cancel(); particle.remove(); }
    particles.clear();
    motion.removeEventListener('change', cleanup);
    pointer.removeEventListener('change', cleanup);
    colors.removeEventListener('change', cleanup);
  };
  const rect = anchor.getBoundingClientRect();
  for (let index = 0; index < 18; index++) {
    const particle = document.createElement('span');
    particle.className = 'download-confetti';
    particle.setAttribute('aria-hidden', 'true');
    particle.style.left = (rect.left + rect.width / 2) + 'px';
    particle.style.top = (rect.top + rect.height / 2) + 'px';
    if (index % 3 === 0) particle.style.background = 'var(--foreground)';
    document.body.append(particle);
    const angle = index * Math.PI * 2 / 18, distance = 45 + Math.random() * 45;
    const animation = particle.animate([
      { transform: 'translate(0, 0) rotate(0)', opacity: 1 },
      { transform: 'translate(' + (Math.cos(angle) * distance) + 'px, ' + (Math.sin(angle) * distance + 28) + 'px) rotate(' + (index * 35) + 'deg)', opacity: 0 }
    ], { duration: 800, easing: 'cubic-bezier(.2,.7,.3,1)' });
    particles.set(particle, animation);
    void animation.finished.catch(() => {}).finally(() => {
      particle.remove(); particles.delete(particle);
      if (particles.size === 0) cleanup();
    });
  }
  motion.addEventListener('change', cleanup);
  pointer.addEventListener('change', cleanup);
  colors.addEventListener('change', cleanup);
  return cleanup;
}
