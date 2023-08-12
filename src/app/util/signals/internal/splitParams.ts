import { Tuple } from '@/util/types/Tuple';

export function splitParams<
    T extends Tuple<unknown>,
    F extends Function,
    O extends {}
>(...params: unknown[]): { source: T, call: F, options?: O } {
    const lastParam = params.pop() as O | Function;

    let options: O | undefined;
    let call: F;
    if (lastParam instanceof Function) {
        call = lastParam as F;
    } else {
        options = lastParam;
        call = params.pop() as F;
    }

    return {
        source: params as unknown as T,
        call,
        options
    };
}
