export class EntityValidationError extends Error {
  constructor(entityName: string, message: string) {
    super(`Validation error in ${entityName}: ${message}`);
    this.name = 'EntityValidationError';
  }
}
