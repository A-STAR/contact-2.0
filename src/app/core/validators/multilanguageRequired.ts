import { ValidatorFn } from '@angular/forms';
import { IMultiLanguageOption } from '@app/shared/components/form/multi-language/multi-language.interface';

export const multilanguageRequired: ValidatorFn = (control) => {
  const options = control.value as IMultiLanguageOption[];
  return !options || options.some(option => option.isMain && !!option.value) ? null : { multilanguageRequired: false };
};
