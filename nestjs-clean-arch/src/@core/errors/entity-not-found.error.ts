export class EntityNotFoundError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = 'EntityNotFoundError';
  }
}
