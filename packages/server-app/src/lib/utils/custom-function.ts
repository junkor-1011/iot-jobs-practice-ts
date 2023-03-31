export interface WrapperFactory<T> {
  get: () => T;
  set: <const U>(decorator: (target: T) => U) => WrapperFactory<U>;
}

export const createWrapperFactory = <const T>(
  target: T,
): WrapperFactory<T> => ({
  get: () => target,
  set: (decorator) => createWrapperFactory(decorator(target)),
});
