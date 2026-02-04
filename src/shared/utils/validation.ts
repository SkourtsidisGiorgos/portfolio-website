import { ValidationError } from '@/shared/errors';

/**
 * Constructor type for validation errors.
 */
export type ValidationErrorConstructor = new (
  message: string,
  field: string
) => ValidationError;

/**
 * Validation rule configuration.
 */
export interface ValidationRule {
  field: string;
  value: unknown;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  customValidator?: (value: unknown) => boolean;
  customMessage?: string;
}

/**
 * Options for validation functions.
 */
export interface ValidationOptions {
  /** Custom error class to use instead of ValidationError */
  ErrorClass?: ValidationErrorConstructor;
}

/**
 * Validate a single field against rules.
 * @throws ValidationError (or custom ErrorClass) if validation fails
 */
export function validateField(
  rule: ValidationRule,
  options: ValidationOptions = {}
): void {
  const {
    field,
    value,
    required,
    minLength,
    maxLength,
    pattern,
    customValidator,
    customMessage,
  } = rule;
  const ErrorClass = options.ErrorClass || ValidationError;

  const stringValue = typeof value === 'string' ? value.trim() : '';

  // Required check
  if (required && (!value || stringValue.length === 0)) {
    throw new ErrorClass(`${capitalize(field)} is required`, field);
  }

  // Skip other validations if empty and not required
  if (!value || stringValue.length === 0) {
    return;
  }

  // Min length check
  if (minLength !== undefined && stringValue.length < minLength) {
    throw new ErrorClass(
      `${capitalize(field)} must be at least ${minLength} characters`,
      field
    );
  }

  // Max length check
  if (maxLength !== undefined && stringValue.length > maxLength) {
    throw new ErrorClass(
      `${capitalize(field)} must be at most ${maxLength} characters`,
      field
    );
  }

  // Pattern check
  if (pattern && !pattern.test(stringValue)) {
    throw new ErrorClass(
      customMessage || `${capitalize(field)} format is invalid`,
      field
    );
  }

  // Custom validator
  if (customValidator && !customValidator(value)) {
    throw new ErrorClass(
      customMessage || `${capitalize(field)} is invalid`,
      field
    );
  }
}

/**
 * Validate multiple fields at once.
 * @throws ValidationError (or custom ErrorClass) on first validation failure
 */
export function validateFields(
  rules: ValidationRule[],
  options: ValidationOptions = {}
): void {
  for (const rule of rules) {
    validateField(rule, options);
  }
}

/**
 * Capitalize first letter of a string.
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
