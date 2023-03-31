export interface WrapperFactory<T> {
  readonly get: () => T;
  readonly set: <const U>(decorator: (target: T) => U) => WrapperFactory<U>;
}

export const createWrapperFactory = <const T>(
  target: T,
): WrapperFactory<T> => ({
  get: () => target,
  set: (decorator) => createWrapperFactory(decorator(target)),
});
