export class EntityValidationError extends Error {
  constructor(entityName: string, message: string) {
    super(`validation error in ${entityName}: ${message}`);
    this.name = 'EntityValidationError';
  }
}
