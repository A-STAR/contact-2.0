import { ValidatorFn } from '@angular/forms';
import { IMultiLanguageOption } from '@app/shared/components/form/multi-language/multi-language.interface';

export const multilanguageRequired = (options: IMultiLanguageOption[]): ValidatorFn => (control) => {
  return !options || options.some(option => option.isMain && !!option.value)
    ? null
    : { multilanguageRequired: false };
};
