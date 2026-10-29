import type { ComponentProps, ReactNode } from 'react';
import { CircleCheck, CircleX, Info, TriangleAlert, X } from 'lucide-react';
import { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './ui/toast.js';
import { Button } from './ui/button.js';
import { cn } from './utils.js';

export type SnackbarVariant = 'error' | 'warning' | 'info' | 'success';
export type SnackbarProps = Omit<ComponentProps<typeof Toast>, 'children' | 'title'> & {
  variant: SnackbarVariant;
  variantLabel: string;
  title: ReactNode;
  description?: ReactNode;
  closeLabel: string;
  action?: { label: string; altText: string; onClick: () => void };
};
const icons = { error: CircleX, warning: TriangleAlert, info: Info, success: CircleCheck };
export function SnackbarProvider(props: ComponentProps<typeof ToastProvider>) {
  return <ToastProvider {...props} />;
}
export function SnackbarViewport({ className, ...props }: ComponentProps<typeof ToastViewport>) {
  return <ToastViewport className={cn('ui-snackbar-viewport', className)} {...props} />;
}
export function Snackbar({ variant, variantLabel, title, description, closeLabel, action, className, duration = variant === 'error' ? Infinity : 5000, ...props }: SnackbarProps) {
  const Icon = icons[variant];
  return <Toast type={variant === 'error' ? 'foreground' : 'background'} duration={duration} {...props} data-slot="snackbar" data-variant={variant} className={cn('ui-snackbar', className)}>
    <span aria-hidden="true" className="ui-snackbar-icon"><Icon strokeWidth={1.75} /></span>
    <div className="ui-snackbar-body"><ToastTitle className="ui-snackbar-title"><span className="sr-only">{variantLabel}: </span>{title}</ToastTitle>{description != null && <ToastDescription className="ui-snackbar-description">{description}</ToastDescription>}</div>
    <ToastClose aria-label={closeLabel} className="ui-snackbar-close"><X aria-hidden="true" /></ToastClose>
    {action && <ToastAction asChild altText={action.altText}><Button type="button" variant="ghost" className="ui-snackbar-action" onClick={action.onClick}>{action.label}</Button></ToastAction>}
  </Toast>;
}
