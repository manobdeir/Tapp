// Base application error class
export class ApplicationError extends Error {
constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
}
}

export class ResourceNotFoundError extends ApplicationError {
constructor(resource: string, identifier?: string | number) {
    super(`${resource}${identifier ? ` with id ${identifier}` : ''} not found`);
}
}

export class InvalidArgumentError extends ApplicationError {
constructor(message: string) {
    super(message);
}
}

export class DuplicateResourceError extends ApplicationError {
constructor(resource: string, field: string, value: string) {
    super(`${resource} with ${field} '${value}' already exists`);
}
}

export class InsufficientInventoryError extends ApplicationError {
constructor(productId: string, requested: number, available: number) {
    super(`Insufficient inventory for product ${productId}. Requested: ${requested}, Available: ${available}`);
}
}
