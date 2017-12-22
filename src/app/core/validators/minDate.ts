import { ValidatorFn } from '@angular/forms';
import * as moment from 'moment';

export const minDate = (minValue: Date): ValidatorFn => {
  return control => {
    const value = control.value as Date;
    return value && value <= minValue ? { min: { minValue } } : null;
  };
};

export const minDateThreeDaysAgo = () => minDate(moment().subtract(3, 'd').toDate());
