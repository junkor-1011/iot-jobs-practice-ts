import { describe, it, expect, vi, afterEach } from 'vitest';

import { createWrapperFactory } from './custom-function';

describe('createWrapperFactory', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  it('create wrapper function(same type: number)', () => {
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

    const decorator2 = (target: TargetFuncType): TargetFuncType => {
      const decorated: TargetFuncType = (x: number) => -1 * target(x);
      return decorated;
    };

    const decoratedFunc2 = createWrapperFactory(targetFunc)
      .set(decorator1)
      .set(decorator2)
      .get();

    expect(decoratedFunc2(1)).toBe(-4); // (1 * 2)^2 * (-1)
    expect(decoratedFunc2(2)).toBe(-16); // (2 * 2)^2 * (-1)
    expect(decoratedFunc2(-1)).toBe(-4); // (-1 * 2)^2 * (-1)
    expect(decoratedFunc2(5)).toBe(-100); // (5 * 2)^2 * (-1)
  });
  it('create wrapper function(same type: string)', () => {
    const targetFunc = (x: string): string => x;
    type TargetFuncType = typeof targetFunc;

    const decorator1 = (target: TargetFuncType): TargetFuncType => {
      const decorated = (x: string): string => target(`prefix1: ${x}`);
      return decorated;
    };

    const decorator2 = (target: TargetFuncType): TargetFuncType => {
      const decorated = (x: string): string => target(`${x} | added`);
      return decorated;
    };

    const decorator3 = (target: TargetFuncType): TargetFuncType => {
      const decorated = (x: string): string => target(`(${x})`);
      return decorated;
    };

    const decoratorWithLog = (target: TargetFuncType): TargetFuncType => {
      const decorated = (x: string): string => {
        console.log(x);
        return x;
      };
      return decorated;
    };

    const decoratedFunc1 = createWrapperFactory(targetFunc)
      .set(decorator1)
      .get();

    expect(decoratedFunc1('hello, world')).toBe('prefix1: hello, world');
    expect(decoratedFunc1('xxx')).toBe('prefix1: xxx');

    const decoratedFunc2 = createWrapperFactory(targetFunc)
      .set(decorator1)
      .set(decorator2)
      .get();

    expect(decoratedFunc2('foo')).toBe('prefix1: foo | added');

    const decoratedFunc3 = createWrapperFactory(targetFunc)
      .set(decorator3)
      .set(decorator1)
      .set(decorator2)
      .get();

    expect(decoratedFunc3('bar')).toBe('(prefix1: bar | added)');

    const decoratedFunc4 = createWrapperFactory(targetFunc)
      .set(decorator1)
      .set(decorator2)
      .set(decorator3)
      .get();

    expect(decoratedFunc4('baz')).toBe('prefix1: (baz) | added');

    global.console.log = vi.fn();
    const decoratedFunc5 = createWrapperFactory(targetFunc)
      .set(decoratorWithLog)
      .set(decorator1)
      .set(decorator2)
      .set(decorator3)
      .get();

    expect(decoratedFunc5('_lol_')).toBe('prefix1: (_lol_) | added');
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith('prefix1: (_lol_) | added');
  });
});
