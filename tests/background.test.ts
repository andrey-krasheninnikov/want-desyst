import { expect, test } from 'bun:test';
import { initBackgroundMotion } from '../packages/foundation/src/background';

for (const delays of [[-1, 1000], [1000, 0], [NaN, 1000], [0, Infinity], [0, 2147483648]] as const) {
  test(`background rejects invalid wave delays ${delays}`, () => {
    expect(() => initBackgroundMotion({ background: {} as HTMLElement, control: {} as HTMLButtonElement, shimmerDelayMs: delays })).toThrow(RangeError);
  });
}
