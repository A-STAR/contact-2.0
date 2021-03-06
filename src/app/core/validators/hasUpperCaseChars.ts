import { ValidatorFn } from '@angular/forms';

export const hasUpperCaseChars: ValidatorFn = control => {
  const value = String(control.value);
  return value.toLowerCase() === value && value.length ? { hasuppercasechars: false } : null;
};
