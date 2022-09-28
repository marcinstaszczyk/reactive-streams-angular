type WithoutFunctions<T> = DeepWithout<T, Function>;

export type Anemia<T> = WithoutFunctions<T>;
