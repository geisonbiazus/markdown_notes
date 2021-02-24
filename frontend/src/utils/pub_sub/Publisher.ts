export interface Publisher {
  publish<T>(event: string, payload?: T): void;
}
