import { useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Popover } from 'radix-ui';
import { Button } from './ui/button.js';

export type DateFieldLabels = {
  date: string;
  datetime: string;
  calendar: string;
  previousYear: string;
  previousMonth: string;
  nextMonth: string;
  nextYear: string;
  hours: string;
  minutes: string;
  today: string;
  clear: string;
  apply: string;
};

export type DateFieldProps = {
  mode: 'date' | 'datetime';
  value: string;
  onChange: (value: string) => void;
  onCommit?: (value: string) => void;
  labels: DateFieldLabels;
  locale: string;
  today?: string;
  ariaLabel?: string;
  disabled?: boolean;
  className?: string;
};

function pad(value: number): string {
  return String(value).padStart(2, '0');
}

function dayKey(date: Date): string {
  return date.getUTCFullYear() + '-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate());
}

function parseStamp(value: string): Date | null {
  const parts = /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?$/.exec(value);
  if (!parts) return null;
  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);
  const hours = Number(parts[4] ?? 0);
  const minutes = Number(parts[5] ?? 0);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hours, minutes, 0, 0);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day
    || date.getUTCHours() !== hours || date.getUTCMinutes() !== minutes) return null;
  return date;
}

function localNow(): Date {
  const date = new Date();
  return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes()));
}

function stamp(date: Date, hours: number, minutes: number, mode: DateFieldProps['mode']): string {
  const day = dayKey(date);
  return mode === 'date' ? day : day + 'T' + pad(hours) + ':' + pad(minutes);
}

function monthStart(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function moveMonth(date: Date, delta: number): Date {
  const first = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1));
  const lastDay = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth() + 1, 0)).getUTCDate();
  return new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), Math.min(date.getUTCDate(), lastDay)));
}

function calendarDays(cursor: Date): Date[] {
  const first = monthStart(cursor);
  const mondayOffset = (first.getUTCDay() + 6) % 7;
  const start = new Date(Date.UTC(first.getUTCFullYear(), first.getUTCMonth(), 1 - mondayOffset));
  return Array.from({ length: 42 }, (_, index) =>
    new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + index)));
}

export function DateField({ mode, value, onChange, onCommit, labels, locale, today, ariaLabel, disabled, className }: DateFieldProps) {
  const [open, setOpen] = useState(false);
  const selected = parseStamp(value);
  const now = parseStamp(today ?? '') ?? localNow();
  const [cursor, setCursor] = useState(() => monthStart(selected ?? now));
  const [focusedDay, setFocusedDay] = useState(() => selected ?? now);
  const contentRef = useRef<HTMLDivElement>(null);
  const latest = useRef(value);
  const committed = useRef(value);
  latest.current = value;

  function change(next: string) {
    latest.current = next;
    onChange(next);
  }

  function commit(next: string) {
    if (next !== value) change(next);
    if (next !== committed.current) onCommit?.(next);
    committed.current = next;
    setOpen(false);
  }

  function onOpenChange(next: boolean) {
    if (next) {
      latest.current = value;
      committed.current = value;
      const date = parseStamp(value) ?? now;
      setCursor(monthStart(date));
      setFocusedDay(date);
    } else if (latest.current !== committed.current) {
      onCommit?.(latest.current);
      committed.current = latest.current;
    }
    setOpen(next);
  }

  function moveFocus(day: Date, key: string, event: KeyboardEvent<HTMLButtonElement>) {
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const weekDay = (day.getUTCDay() + 6) % 7;
    let next: Date;
    switch (key) {
      case 'ArrowLeft': next = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() + (rtl ? 1 : -1))); break;
      case 'ArrowRight': next = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() + (rtl ? -1 : 1))); break;
      case 'ArrowUp': next = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() - 7)); break;
      case 'ArrowDown': next = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() + 7)); break;
      case 'Home': next = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() - weekDay)); break;
      case 'End': next = new Date(Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate() + 6 - weekDay)); break;
      case 'PageUp': next = moveMonth(day, -1); break;
      case 'PageDown': next = moveMonth(day, 1); break;
      default: return;
    }
    event.preventDefault();
    setCursor(monthStart(next));
    setFocusedDay(next);
    requestAnimationFrame(() => {
      contentRef.current?.querySelector<HTMLButtonElement>('[data-day="' + dayKey(next) + '"]')?.focus();
    });
  }

  const hours = selected?.getUTCHours() ?? now.getUTCHours();
  const minutes = selected?.getUTCMinutes() ?? now.getUTCMinutes();
  const formatter = new Intl.DateTimeFormat(locale, mode === 'date'
    ? { dateStyle: 'medium', timeZone: 'UTC' }
    : { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' });
  const dayFormatter = new Intl.DateTimeFormat(locale, { dateStyle: 'full', timeZone: 'UTC' });
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2026, 0, 5 + index))));
  const days = calendarDays(cursor);
  const chosen = selected ? dayKey(selected) : '';

  return <Popover.Root open={open} onOpenChange={onOpenChange}>
    <div data-slot="date-field" className={className ? 'ui-date-field ' + className : 'ui-date-field'}>
      <Popover.Trigger asChild>
        <Button type="button" variant="outline" className="ui-date-trigger" disabled={disabled} aria-label={ariaLabel ?? labels[mode] + (selected ? ': ' + formatter.format(selected) : '')}>
          {selected ? formatter.format(selected) : labels[mode]}
        </Button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content ref={contentRef} data-slot="date-popover" className="ui-date-popover" sideOffset={8} collisionPadding={8} aria-label={labels.calendar}>
          <div className="ui-date-heading" aria-live="polite">
            {new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(cursor)}
          </div>
          <div className="ui-date-nav">
            <Button type="button" variant="ghost" size="icon" aria-label={labels.previousYear} onClick={() => setCursor(monthStart(moveMonth(cursor, -12)))}><ChevronsLeft aria-hidden="true" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label={labels.previousMonth} onClick={() => setCursor(monthStart(moveMonth(cursor, -1)))}><ChevronLeft aria-hidden="true" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label={labels.nextMonth} onClick={() => setCursor(monthStart(moveMonth(cursor, 1)))}><ChevronRight aria-hidden="true" /></Button>
            <Button type="button" variant="ghost" size="icon" aria-label={labels.nextYear} onClick={() => setCursor(monthStart(moveMonth(cursor, 12)))}><ChevronsRight aria-hidden="true" /></Button>
          </div>
          <table className="ui-date-grid">
            <thead><tr>{weekdays.map((day, index) => <th key={index} scope="col">{day}</th>)}</tr></thead>
            <tbody>{Array.from({ length: 6 }, (_, row) =>
              <tr key={row}>{days.slice(row * 7, row * 7 + 7).map((day) => {
                const key = dayKey(day);
                return <td key={key}>
                  <button type="button" data-slot="date-day" data-day={key} className="ui-date-day"
                    data-outside={day.getUTCMonth() !== cursor.getUTCMonth() || undefined}
                    aria-label={dayFormatter.format(day)} aria-pressed={key === chosen}
                    aria-current={key === dayKey(now) ? 'date' : undefined}
                    tabIndex={key === dayKey(focusedDay) ? 0 : -1}
                    onKeyDown={(event) => moveFocus(day, event.key, event)}
                    onClick={() => {
                      const next = stamp(day, hours, minutes, mode);
                      if (mode === 'date') commit(next);
                      else {
                        change(next);
                        setCursor(monthStart(day));
                        setFocusedDay(day);
                      }
                    }}>{day.getUTCDate()}</button>
                </td>;
              })}</tr>)}</tbody>
          </table>
          {mode === 'datetime' ? <div className="ui-date-time">
            <label>{labels.hours}<input type="number" min="0" max="23" value={hours} onChange={(event) => {
              const nextHours = Math.min(23, Math.max(0, Number(event.currentTarget.value) || 0));
              change(stamp(selected ?? cursor, nextHours, minutes, mode));
            }} /></label>
            <label>{labels.minutes}<input type="number" min="0" max="59" value={minutes} onChange={(event) => {
              const nextMinutes = Math.min(59, Math.max(0, Number(event.currentTarget.value) || 0));
              change(stamp(selected ?? cursor, hours, nextMinutes, mode));
            }} /></label>
          </div> : null}
          <div className="ui-date-actions">
            <Button type="button" variant="ghost" onClick={() => commit('')}>{labels.clear}</Button>
            <Button type="button" variant="ghost" onClick={() => {
              const next = stamp(now, now.getUTCHours(), now.getUTCMinutes(), mode);
              if (mode === 'date') commit(next);
              else change(next);
            }}>{labels.today}</Button>
            {mode === 'datetime' ? <Button type="button" onClick={() => commit(latest.current)}>{labels.apply}</Button> : null}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </div>
  </Popover.Root>;
}
