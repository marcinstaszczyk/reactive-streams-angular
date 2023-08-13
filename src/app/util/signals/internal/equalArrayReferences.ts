export function equalArrayReferences(a: any[] = [], b: any[] = []): boolean {
    for(let i = 0; i < a.length; ++i) {
        if (a[i] !== b[i]) {
            return false;
        }
    }
    return true;
}
