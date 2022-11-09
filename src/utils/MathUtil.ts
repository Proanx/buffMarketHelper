export function isNumber(testVal: string | number): boolean {
    return Number.isFinite(+testVal) || +testVal === 0;
}

export function isNotNumber(testVal: string | number): boolean {
    return !isNumber(testVal);
}