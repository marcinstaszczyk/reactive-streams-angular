type DeepWithout<T, V, WithNevers = {
    [K in keyof T]: Exclude<T[K], undefined> extends V ? never
        : (T[K] extends Record<string, unknown> ? DeepWithout<T[K], V> : T[K])
}> = Pick<WithNevers, {
    [K in keyof WithNevers]: WithNevers[K] extends never ? never : K
}[keyof WithNevers]>
