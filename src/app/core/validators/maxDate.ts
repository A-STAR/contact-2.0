import { ValidatorFn } from '@angular/forms';

export const maxDate = (maxValue: Date): ValidatorFn => {
  return control => {
    const value = control.value as Date;
    return value && value >= maxValue ? { max: { maxValue } } : null;
  };
}
