export function getOrCreate<K, V>(map: Map<K, V>, key: K, objConstructor: () => V) {
    let v = map.get(key);
    if (v !== undefined) return v;

    v = objConstructor();
    map.set(key, v);
    return v;
}
