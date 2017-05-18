import { ValidatorFn } from '@angular/forms';

export const hasLowerCaseChars: ValidatorFn = control => {
  const value = String(control.value);
  return value.toUpperCase() === value && value.length ? { hasLowerCaseChars: false } : null;
};
