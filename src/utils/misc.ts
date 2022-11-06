export function copy2dArray<T>(arr: T[][]): T[][] {
  return arr.map((n) => n.slice(0));
}
