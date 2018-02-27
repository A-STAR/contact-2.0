import { ValidatorFn } from '@angular/forms';

export const min = (minValue: number): ValidatorFn => {
  return control => {
    const value = Number(control.value);
    return typeof value === 'number' && value < minValue ? { min: { minValue } } : null;
  };
};
