import { FormGroup, ValidatorFn } from '@angular/forms';

export const oneOfGroupRequired: ValidatorFn = (group: FormGroup) => {
  const isEmpty = Object.keys(group.controls).reduce((acc, key) => acc && !group.controls[key].value, true);
  return isEmpty ? { oneofgrouprequired: false } : null;
};
