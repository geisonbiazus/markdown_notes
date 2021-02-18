export type Errors = Record<string, string>;

export function validateRequired<T>(errors: Errors, state: T, field: keyof T): Errors {
  if (!`${state[field]}`.trim()) {
    return { ...errors, [field]: 'required' };
  }
  return errors;
}

export function validateEmail<T>(errors: Errors, state: T, field: keyof T): Errors {
  const value = `${state[field]}`.trim();

  if (value && !value.includes('@')) {
    return { ...errors, [field]: 'invalid_email' };
  }
  return errors;
}

export function validateConfirmation<T>(
  errors: Errors,
  state: T,
  field: keyof T,
  confirmationField: keyof T
): Errors {
  const value = `${state[field]}`.trim();
  const confirmation = `${state[confirmationField]}`.trim();

  if (value && confirmation && value !== confirmation) {
    return { ...errors, [field]: 'does_not_match_confirmation' };
  }
  return errors;
}
