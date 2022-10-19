type DeepOmitByType<T, U>= keyof T extends never ? T
    : T extends (infer I)[] ? DeepOmitByType<I, U>[]
        : {
            [P in keyof T as (T[P] extends U ? never : P)]: DeepOmitByType<T[P], U>
        };
