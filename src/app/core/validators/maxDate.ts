import { ValidatorFn } from '@angular/forms';

export const maxDate = (maxValue: Date): ValidatorFn => {
  return control => {
    const value = control.value as Date;
    return value >= maxValue ? { max: { maxValue } } : null;
  };
}
