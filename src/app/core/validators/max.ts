import { ValidatorFn } from '@angular/forms';

export const max = (maxValue: number): ValidatorFn => {
  return control => {
    const value = Number(control.value);
    return typeof value !== 'number' || value == null || value >= maxValue ? { min: false } : null;
  };
}
