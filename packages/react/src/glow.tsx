import type { ComponentProps } from 'react';
import { cn } from './utils.js';

export type GlowProps = Omit<ComponentProps<'span'>, 'children'> & { paused?: boolean };
export function Glow({ paused = false, className, ...props }: GlowProps) {
  return <span {...props} data-slot="glow" data-paused={paused || undefined} aria-hidden="true" className={cn('ui-glow', className)} />;
}
