import { createElement, type HTMLAttributes } from 'react';
import type tokens from '@want-foundation/desyst-foundation/tokens.json';
import { cn } from './utils.js';

export type TypographyVariant = keyof typeof tokens.typography.styles;
const elements: Record<TypographyVariant, string> = {
  display: 'h1', h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6',
  lead: 'p', body: 'p', small: 'p', caption: 'p', label: 'span', overline: 'p', mono: 'p',
  code: 'code', 'code-block': 'pre', quote: 'blockquote',
};
export type TypographyProps = HTMLAttributes<HTMLElement> & {
  variant?: TypographyVariant;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'code' | 'pre' | 'blockquote' | 'label';
  tone?: 'default' | 'muted' | 'primary' | 'error' | 'warning' | 'info' | 'success';
  align?: 'start' | 'center' | 'end';
  htmlFor?: string;
};

export function Typography({ variant = 'body', as, tone = 'default', align = 'start', className, ...props }: TypographyProps) {
  const technical = variant === 'mono' || variant === 'code' || variant === 'code-block';
  return createElement(as ?? elements[variant], { ...props, dir: props.dir ?? (technical ? 'ltr' : undefined), 'data-slot': 'typography', 'data-variant': variant, 'data-tone': tone, 'data-align': align, className: cn('ui-typography', className) });
}

export type ProseProps = HTMLAttributes<HTMLDivElement>;
export function Prose({ className, ...props }: ProseProps) {
  return <div data-slot="prose" className={cn('ui-prose', className)} {...props} />;
}
