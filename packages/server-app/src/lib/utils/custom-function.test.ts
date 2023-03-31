import { describe, it, expect } from 'vitest';

import { createWrapperFactory } from './custom-function';

describe('createWrapperFactory', () => {
  it('create wrapper function(same type)', () => {
    const targetFunc = (x: number): number => x * x;
    type TargetFuncType = typeof targetFunc;

    const decorator1 = (target: TargetFuncType): TargetFuncType => {
      const decorated: TargetFuncType = (x: number) => target(2 * x);
      return decorated;
    };

    const decoratedFunc1 = createWrapperFactory(targetFunc)
      .set(decorator1)
      .get();

    expect(decoratedFunc1(1)).toBe(4); // (1 * 2)^2
    expect(decoratedFunc1(2)).toBe(16); // (2 * 2)^2
    expect(decoratedFunc1(-1)).toBe(4); // (-1 * 2)^2
    expect(decoratedFunc1(5)).toBe(100); // (5 * 2)^2
  });
});
