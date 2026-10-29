import type { ComponentProps } from 'react';
import { DropdownMenu as MenuPrimitive } from 'radix-ui';
import { cn } from '../utils.js';

export const DropdownMenu = MenuPrimitive.Root;
export const DropdownMenuTrigger = MenuPrimitive.Trigger;
export const DropdownMenuGroup = MenuPrimitive.Group;

export function DropdownMenuContent({ className, sideOffset = 6, ...props }: ComponentProps<typeof MenuPrimitive.Content>) {
  return <MenuPrimitive.Portal><MenuPrimitive.Content data-slot="dropdown-menu-content" sideOffset={sideOffset} collisionPadding={8} className={cn('ui-dropdown-menu', className)} {...props} /></MenuPrimitive.Portal>;
}

export function DropdownMenuItem({ className, ...props }: ComponentProps<typeof MenuPrimitive.Item>) {
  return <MenuPrimitive.Item data-slot="dropdown-menu-item" className={cn('ui-menu-item', className)} {...props} />;
}

export function DropdownMenuLabel({ className, ...props }: ComponentProps<typeof MenuPrimitive.Label>) {
  return <MenuPrimitive.Label data-slot="dropdown-menu-label" className={cn('ui-menu-label', className)} {...props} />;
}
