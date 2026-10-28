import type { ComponentProps } from 'react';
import { cn } from './utils.js';

export type BrandLogoProps = ComponentProps<'img'> & { src: string; alt: string };
export function BrandLogo({ className, width = 32, height = 32, ...props }: BrandLogoProps) {
  return <img width={width} height={height} className={cn('brand-logo', className)} {...props} />;
}
export type BrandLockupProps = Omit<ComponentProps<'a'>, 'children'> & { name: string; logoSrc: string; subtitle?: string };
export function BrandLockup({ name, logoSrc, subtitle, className, ...props }: BrandLockupProps) {
  return <a aria-label={name} className={cn('brand-lockup', className)} {...props}>
    <BrandLogo src={logoSrc} alt="" /><span>{name}{subtitle && <small>{subtitle}</small>}</span>
  </a>;
}
