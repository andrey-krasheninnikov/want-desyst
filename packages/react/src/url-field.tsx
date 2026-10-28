import { useId, type ReactNode } from 'react';
import { ExternalLink } from 'lucide-react';
import { cn } from './utils.js';
import { Input } from './ui/input.js';

export function isHttpUrl(raw: string): boolean {
  try {
    const url = new URL(raw.trim());
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export type OpenUrlProps = {
  href: string;
  label: string;
  className?: string;
};

export function OpenUrl({ href, label, className }: OpenUrlProps) {
  if (!isHttpUrl(href)) return null;
  return <a data-slot="open-url" className={cn('ui-open-url', className)} href={href.trim()} target="_blank" rel="noopener noreferrer" aria-label={label}>
    <ExternalLink aria-hidden="true" size={18} />
  </a>;
}

export type UrlFieldProps = {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  onBlur?: (value: string) => void;
  openLabel: string;
  placeholder?: string;
  id?: string;
  name?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
};

export function UrlField({ label, value, onChange, onBlur, openLabel, placeholder = 'https://', id, name, disabled, required, className }: UrlFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return <div data-slot="url-field" className={cn('ui-url-field', className)}>
    <label className="ui-url-field-label" htmlFor={inputId}>{label}</label>
    <div className="ui-url-field-row">
      <Input id={inputId} name={name} type="url" inputMode="url" dir="ltr" autoComplete="off" value={value} placeholder={placeholder} disabled={disabled} required={required}
        onChange={(event) => onChange(event.currentTarget.value)}
        onBlur={onBlur ? (event) => onBlur(event.currentTarget.value) : undefined} />
      {disabled ? null : <OpenUrl href={value} label={openLabel} />}
    </div>
  </div>;
}
