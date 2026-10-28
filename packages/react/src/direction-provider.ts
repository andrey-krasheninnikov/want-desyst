import { Direction } from 'radix-ui';
import type { ComponentType, PropsWithChildren } from 'react';
export type DirectionProviderProps = PropsWithChildren<{ dir: 'ltr' | 'rtl' }>;
export const DirectionProvider: ComponentType<DirectionProviderProps> = Direction.Provider;
