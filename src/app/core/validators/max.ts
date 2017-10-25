import { ValidatorFn } from '@angular/forms';

export const maxStrict = (maxValue: number): ValidatorFn => {
  return control => {
    const value = Number(control.value);
    return typeof value === 'number' && value >= maxValue ? { max: { maxValue } } : null;
  };
};

export const max = (maxValue: number): ValidatorFn => {
  return control => {
    const value = Number(control.value);
    return typeof value === 'number' && value > maxValue ? { max: { maxValue } } : null;
  };
};
