export function validateNumString(numStr: string): boolean {
  return Boolean(numStr.match(/^\d+\.?\d*$/));
}
