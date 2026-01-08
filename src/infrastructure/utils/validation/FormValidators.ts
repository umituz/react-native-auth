import { ValidationResult } from './types';

/**
 * Batch validation helper
 * Validates multiple fields and returns all errors in a record
 */
export const batchValidate = (
  validations: Array<{ field: string; validator: () => ValidationResult }>,
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  validations.forEach(({ field, validator }) => {
    const result = validator();
    if (!result.isValid && result.error) {
      errors[field] = result.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};
