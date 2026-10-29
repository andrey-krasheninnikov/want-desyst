import type { ComponentProps } from 'react';
import { cn } from '../utils.js';

export function Table({ className, ...props }: ComponentProps<'table'>) {
  return <div className="ui-table-scroll" tabIndex={0}><table data-slot="table" className={cn('ui-table', className)} {...props} /></div>;
}
export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return <caption data-slot="table-caption" className={cn('ui-table-caption', className)} {...props} />;
}
export function TableHeader(props: ComponentProps<'thead'>) { return <thead data-slot="table-header" {...props} />; }
export function TableBody(props: ComponentProps<'tbody'>) { return <tbody data-slot="table-body" {...props} />; }
export function TableFooter(props: ComponentProps<'tfoot'>) { return <tfoot data-slot="table-footer" {...props} />; }
export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return <tr data-slot="table-row" className={cn('ui-table-row', className)} {...props} />;
}
export function TableHead({ className, scope = 'col', ...props }: ComponentProps<'th'>) {
  return <th data-slot="table-head" scope={scope} className={cn('ui-table-cell ui-table-head', className)} {...props} />;
}
export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return <td data-slot="table-cell" className={cn('ui-table-cell', className)} {...props} />;
}
