import { Moon, Sun } from 'lucide-react';
import { Switch } from './ui/switch.js';

export type ThemeToggleProps = {
  theme: 'light' | 'dark'; onThemeChange: (theme: 'light' | 'dark') => void;
  label: string; title?: string; disabled?: boolean;
};
export function ThemeToggle({ theme, onThemeChange, label, title, disabled }: ThemeToggleProps) {
  return <span className="theme-switch" data-theme={theme} dir="ltr">
    <Switch className="theme-toggle" checked={theme === 'dark'} aria-label={label} title={title}
      disabled={disabled} onCheckedChange={checked => onThemeChange(checked ? 'dark' : 'light')} />
    <Sun className="theme-symbol theme-sun" aria-hidden="true" /><Moon className="theme-symbol theme-moon" aria-hidden="true" />
  </span>;
}
