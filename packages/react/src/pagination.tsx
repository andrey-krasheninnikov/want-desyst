import { useId, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select.js';
import { cn } from './utils.js';

export type PaginationProps = {
  page: number;
  pageSize: number;
  totalItems: number;
  onChange: (page: number, pageSize: number) => void;
  pageSizeOptions?: number[];
  labels: { navigation: string; previous: string; next: string; pageSize: string; page: (page: number) => string; results: (from: number, to: number, total: number) => ReactNode };
  className?: string;
};

export function Pagination({ page, pageSize, totalItems, onChange, pageSizeOptions = [10, 25, 50], labels, className }: PaginationProps) {
  const sizeId = useId();
  const size = Number.isFinite(pageSize) ? Math.max(1, Math.floor(pageSize)) : 10;
  const total = Number.isFinite(totalItems) ? Math.max(0, Math.floor(totalItems)) : 0;
  const count = Math.max(1, Math.ceil(total / size));
  const current = Number.isFinite(page) ? Math.min(count, Math.max(1, Math.floor(page))) : 1;
  const start = Math.max(1, Math.min(current - 2, count - 4));
  const pages = Array.from({ length: Math.min(5, count) }, (_, index) => start + index);
  const sizes = [...new Set([size, ...pageSizeOptions.filter(value => Number.isInteger(value) && value > 0)])].sort((a, b) => a - b);
  return <nav data-slot="pagination" aria-label={labels.navigation} className={cn('ui-pagination', className)}>
    <p className="ui-pagination-results" dir="auto" aria-live="polite">{labels.results(total ? (current - 1) * size + 1 : 0, Math.min(current * size, total), total)}</p>
    <div className="ui-pagination-pages">
      <Button type="button" variant="secondary" size="icon" aria-label={labels.previous} disabled={current === 1} onClick={() => onChange(current - 1, size)}><ChevronLeft aria-hidden="true" /></Button>
      {pages.map(value => <Button type="button" key={value} variant={value === current ? 'default' : 'ghost'} aria-label={labels.page(value)} aria-current={value === current ? 'page' : undefined} onClick={() => { if (value !== current) onChange(value, size); }}>{value}</Button>)}
      <Button type="button" variant="secondary" size="icon" aria-label={labels.next} disabled={current === count} onClick={() => onChange(current + 1, size)}><ChevronRight aria-hidden="true" /></Button>
    </div>
    <div className="ui-pagination-size"><label htmlFor={sizeId}>{labels.pageSize}</label>
      <Select value={String(size)} onValueChange={value => onChange(1, Number(value))}><SelectTrigger id={sizeId}><SelectValue /></SelectTrigger><SelectContent>{sizes.map(value => <SelectItem key={value} value={String(value)}>{value}</SelectItem>)}</SelectContent></Select>
    </div>
  </nav>;
}
