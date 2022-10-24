export function check1dArrayEquality<T extends number>(arr1: T[], arr2: T[]) {
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

export function copy2dArray<T>(arr: T[][]): T[][] {
  return arr.map((nestedArr) => [...nestedArr]);
}
