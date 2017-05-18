import { ValidatorFn } from '@angular/forms';

export const hasDigits: ValidatorFn = control => {
  const value = String(control.value);
  const regexp = /\d/g;
  return !regexp.test(value) && value.length ? { hasdigits: false } : null;
};
