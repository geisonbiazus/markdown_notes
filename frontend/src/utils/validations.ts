export type ErrorType = 'required' | 'not_found';
export type Errors = Record<string, ErrorType>;

export function validateRequired<T>(errors: Errors, state: T, field: keyof T): Errors {
  if (!`${state[field]}`.trim()) {
    return { ...errors, [field]: 'required' };
  }
  return errors;
}
