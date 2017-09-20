import { ValidatorFn } from '@angular/forms';

export const minDate = (minValue: Date): ValidatorFn => {
  return control => {
    const value = control.value as Date;
    return value && value <= minValue ? { min: { minValue } } : null;
  };
}
