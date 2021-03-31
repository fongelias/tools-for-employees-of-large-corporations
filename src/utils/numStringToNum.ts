// this is a wrapper around parseInt so that we have more control over the usage and type definitions
export function numStringToNum(numStr: string): number {
  return parseFloat(numStr);
}
