export class ValidationError {
  constructor(
    public field: string,
    public type: string,
    public constraints?: Record<string, number | string | undefined>
  ) {}
}
