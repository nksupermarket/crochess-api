export function check1dArrayEquality(arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}
export function copy2dArray(arr) {
    return arr.map((nestedArr) => [...nestedArr]);
}
//# sourceMappingURL=misc.js.map