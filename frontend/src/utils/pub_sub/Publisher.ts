export interface Publisher {
  pusblish<T>(event: string, payload?: T): void;
}
