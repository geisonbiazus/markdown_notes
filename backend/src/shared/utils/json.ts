export function json(value: any): any {
  return JSON.parse(JSON.stringify(value));
}
