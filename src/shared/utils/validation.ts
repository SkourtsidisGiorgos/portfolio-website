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

/** Context for validation helper functions */
interface ValidationContext {
  field: string;
  value: unknown;
  stringValue: string;
  ErrorClass: ValidationErrorConstructor;
}

/**
 * Validates the required constraint.
 */
function validateRequired(ctx: ValidationContext): void {
  if (!ctx.value || ctx.stringValue.length === 0) {
    throw new ctx.ErrorClass(`${capitalize(ctx.field)} is required`, ctx.field);
  }
}

/**
 * Validates length constraints.
 */
function validateLength(
  ctx: ValidationContext,
  minLength: number | undefined,
  maxLength: number | undefined
): void {
  if (minLength !== undefined && ctx.stringValue.length < minLength) {
    throw new ctx.ErrorClass(
      `${capitalize(ctx.field)} must be at least ${minLength} characters`,
      ctx.field
    );
  }
  if (maxLength !== undefined && ctx.stringValue.length > maxLength) {
    throw new ctx.ErrorClass(
      `${capitalize(ctx.field)} must be at most ${maxLength} characters`,
      ctx.field
    );
  }
}

/** Options for pattern and custom validation */
interface PatternValidationOptions {
  pattern?: RegExp;
  customValidator?: (value: unknown) => boolean;
  customMessage?: string;
}

/**
 * Validates pattern and custom validator constraints.
 */
function validatePatternAndCustom(
  ctx: ValidationContext,
  opts: PatternValidationOptions
): void {
  if (opts.pattern && !opts.pattern.test(ctx.stringValue)) {
    throw new ctx.ErrorClass(
      opts.customMessage || `${capitalize(ctx.field)} format is invalid`,
      ctx.field
    );
  }
  if (opts.customValidator && !opts.customValidator(ctx.value)) {
    throw new ctx.ErrorClass(
      opts.customMessage || `${capitalize(ctx.field)} is invalid`,
      ctx.field
    );
  }
}

/**
 * Validate a single field against rules.
 * @throws ValidationError (or custom ErrorClass) if validation fails
 */
export function validateField(
  rule: ValidationRule,
  options: ValidationOptions = {}
): void {
  const { field, value, required, minLength, maxLength } = rule;
  const ErrorClass = options.ErrorClass || ValidationError;
  const stringValue = typeof value === 'string' ? value.trim() : '';
  const ctx: ValidationContext = { field, value, stringValue, ErrorClass };

  if (required) {
    validateRequired(ctx);
  }

  // Skip other validations if empty and not required
  if (!value || stringValue.length === 0) {
    return;
  }

  validateLength(ctx, minLength, maxLength);
  validatePatternAndCustom(ctx, {
    pattern: rule.pattern,
    customValidator: rule.customValidator,
    customMessage: rule.customMessage,
  });
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
