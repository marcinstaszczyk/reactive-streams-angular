import { DeepOmitByType } from './DeepOmitByType';

type WithoutFunctions<T> = DeepOmitByType<T, Function>;

export type Anemia<T> = WithoutFunctions<T>;
