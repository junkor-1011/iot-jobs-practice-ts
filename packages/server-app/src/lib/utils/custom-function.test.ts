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
  it('convert return type', () => {
    const targetFunc = (x: number): number => x;

    const decoratorA = <Args extends readonly unknown[], Return>(
      target: (...args: Args) => Return,
    ): ((...args: Args) => Return) => {
      const decorated = (...args: Args): Return => {
        console.log(args);

        const ret = target(...args);
        console.log(ret);

        return ret;
      };
      return decorated;
    };

    const decoratorB = <Args extends readonly unknown[]>(
      target: (...args: Args) => number,
    ): ((...args: Args) => string) => {
      const decorated = (...args: Args): string => {
        const value = target(...args);
        return `value: ${value}`;
      };
      return decorated;
    };

    // mock
    global.console.log = vi.fn();

    const decoratedFunc = createWrapperFactory(targetFunc)
      .set(decoratorB)
      .set(decoratorA)
      .get();

    expect(decoratedFunc(3)).toBe('value: 3');
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(console.log).toHaveBeenCalledWith([3]);
    expect(console.log).toHaveBeenCalledWith('value: 3');
  });
  it('add arg', () => {
    const targetFunc = (name: string): string => `Hello, ${name}.`;

    const decorator = (
      target: typeof targetFunc,
    ): ((firstName: string, lastName: string) => string) => {
      const decorated = (firstName: string, lastName: string): string =>
        target(`${firstName} ${lastName}`);
      return decorated;
    };

    const decoratedFunc = createWrapperFactory(targetFunc).set(decorator).get();

    expect(decoratedFunc('John', 'Smith')).toBe('Hello, John Smith.');
  });
});
