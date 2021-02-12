export type Errors = Record<string, string>;

export function validateRequired<T>(errors: Errors, state: T, field: keyof T): Errors {
  if (!`${state[field]}`.trim()) {
    return { ...errors, [field]: 'required' };
  }
  return errors;
}
