/**
 * Base error class for all application errors.
 * Provides consistent error handling across layers.
 */
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'APP_ERROR'
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
    };
  }
}

/**
 * Validation error for input validation failures.
 */
export class ValidationError extends AppError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    Object.setPrototypeOf(this, ValidationError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      field: this.field,
    };
  }
}

/**
 * Domain error for business rule violations.
 */
export class DomainError extends AppError {
  constructor(message: string) {
    super(message, 'DOMAIN_ERROR');
    this.name = 'DomainError';
    Object.setPrototypeOf(this, DomainError.prototype);
  }
}

/**
 * Infrastructure error for external service failures.
 */
export class InfrastructureError extends AppError {
  constructor(
    message: string,
    public readonly service: string
  ) {
    super(message, 'INFRASTRUCTURE_ERROR');
    this.name = 'InfrastructureError';
    Object.setPrototypeOf(this, InfrastructureError.prototype);
  }

  toJSON() {
    return {
      ...super.toJSON(),
      service: this.service,
    };
  }
}

/**
 * Not found error for missing resources.
 */
export class NotFoundError extends AppError {
  constructor(resource: string, identifier?: string) {
    const message = identifier
      ? `${resource} with id '${identifier}' not found`
      : `${resource} not found`;
    super(message, 'NOT_FOUND');
    this.name = 'NotFoundError';
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Type guard to check if error is an AppError.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Extract error message from unknown error type.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}
