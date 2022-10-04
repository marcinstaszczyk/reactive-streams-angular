type DeepOmitByType<T, U>= keyof T extends never
    ? T
    : {
        [P in keyof T as (T[P] extends U ? never : P)]: DeepOmitByType<T[P], U>
    };
