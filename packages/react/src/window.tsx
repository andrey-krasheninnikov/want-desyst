import { useId, type ReactNode } from 'react';
import { cn } from './utils.js';

export type WindowProps = {
  title: string;
  kicker?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Window({ title, kicker, actions, children, className }: WindowProps) {
  const titleId = useId();
  return <section data-slot="window" aria-labelledby={titleId} className={cn('ui-window', className)}>
    <header data-slot="window-header" className="ui-window-header">
      <div>
        {kicker ? <p data-slot="window-kicker" className="ui-window-kicker">{kicker}</p> : null}
        <h1 id={titleId}>{title}</h1>
      </div>
      {actions ? <div data-slot="window-actions" className="ui-window-actions">{actions}</div> : null}
    </header>
    <div data-slot="window-body" className="ui-window-body">{children}</div>
  </section>;
}
