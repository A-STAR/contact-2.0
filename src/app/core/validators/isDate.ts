import { ValidatorFn } from '@angular/forms';

export const isDate: ValidatorFn = control => {
  return control.value == null || !control.value
    ? null
    : Object.prototype.toString.call(control.value) !== '[object Date]'
      ? { isDate: false }
      : null;
}
