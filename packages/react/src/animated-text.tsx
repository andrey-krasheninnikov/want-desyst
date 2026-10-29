import type { ComponentProps } from 'react';
import { cn } from './utils.js';

export type AnimatedTextProps = Omit<ComponentProps<'span'>, 'children'> & {
  text: string;
  effect?: 'fade' | 'slide' | 'blur';
};
export function AnimatedText({ text, effect = 'slide', className, ...props }: AnimatedTextProps) {
  return <span {...props} data-slot="animated-text" data-effect={effect} className={cn('ui-animated-text', className)}><span key={text} className="ui-animated-text-value">{text}</span></span>;
}
