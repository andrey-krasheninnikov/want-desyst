import { expect, test } from 'bun:test';
import tokens from '../packages/foundation/tokens.json';

test('wallpapers preserves the approved dark and light palette', () => {
  expect(tokens.themes.wallpapers.dark.primary).toBe('#5962F0');
  expect(tokens.themes.wallpapers.dark.background).toBe('#141414');
  expect(tokens.themes.wallpapers.light.background).toBe('#F6F5F3');
});

test('geometry and glass values remain usable outside CSS', () => {
  expect(tokens.geometry.fieldRadiusPx).toBe(12);
  expect(tokens.glass.blurPx).toBe(20);
  expect(tokens.glass.opacityPercent).toBe(68);
  expect(tokens.motion.feedbackMs).toBe(120);
});
