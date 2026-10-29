import type { ComponentProps } from 'react';
import { Toast as ToastPrimitive } from 'radix-ui';
import { cn } from '../utils.js';

export const ToastProvider = ToastPrimitive.Provider;
export function ToastTitle({ className, ...props }: ComponentProps<typeof ToastPrimitive.Title>) {
  return <ToastPrimitive.Title data-slot="toast-title" className={cn('ui-toast-title', className)} {...props} />;
}
export function ToastDescription({ className, ...props }: ComponentProps<typeof ToastPrimitive.Description>) {
  return <ToastPrimitive.Description data-slot="toast-description" className={cn('ui-toast-description', className)} {...props} />;
}
export const ToastAction = ToastPrimitive.Action;

export function Toast({ className, ...props }: ComponentProps<typeof ToastPrimitive.Root>) {
  return <ToastPrimitive.Root data-slot="toast" className={cn('ui-toast', className)} {...props} />;
}

export function ToastClose({ className, ...props }: ComponentProps<typeof ToastPrimitive.Close>) {
  return <ToastPrimitive.Close data-slot="toast-close" className={cn('ui-toast-close', className)} {...props} />;
}

export function ToastViewport({ className, ...props }: ComponentProps<typeof ToastPrimitive.Viewport>) {
  return <ToastPrimitive.Viewport data-slot="toast-viewport" className={cn('ui-toast-viewport', className)} {...props} />;
}
