import type { ComponentProps, ComponentType, SVGProps } from 'react';
import { ArrowUpRight, Link as LinkIcon } from 'lucide-react';
import { cn } from './utils.js';

export type ContactAction = { title: string; detail?: string; href: string; label?: string; external?: boolean; icon?: ComponentType<SVGProps<SVGSVGElement>> };
export type ContactCardProps = ComponentProps<'div'> & { name: string; subtitle?: string; actions: ContactAction[] };
export function ContactCard({ name, subtitle, actions, className, ...props }: ContactCardProps) {
  return <div className={cn('contact-card', className)} {...props}>
    <div className="contact-identity"><span className="contact-avatar" aria-hidden="true">{name.split(' ').map(part => part[0]).join('').slice(0, 2)}</span><div><strong>{name}</strong>{subtitle && <small>{subtitle}</small>}</div></div>
    <div className="contact-actions">{actions.map(({ title, detail, href, label, external, icon: Icon = LinkIcon }) => {
      const newTab = external ?? /^https?:/.test(href);
      return <a key={href} className="contact-link" href={href} target={newTab ? '_blank' : undefined} rel={newTab ? 'noopener noreferrer' : undefined} aria-label={label}>
        <Icon aria-hidden="true" /><span>{title}{detail && <small title={detail} dir="ltr">{detail}</small>}</span><ArrowUpRight className="contact-arrow" aria-hidden="true" />
      </a>;
    })}</div>
  </div>;
}
