import { Validators } from '@angular/forms';

import { hasLowerCaseChars } from './hasLowerCaseChars';
import { hasUpperCaseChars } from './hasUpperCaseChars';
import { hasDigits } from './hasDigits';

const complexityValidators = complex => complex ? [
  hasDigits,
  hasLowerCaseChars,
  hasUpperCaseChars,
] : [];

const requiredValidators = required => required ? [
  Validators.required
] : [];

export const password = (required: boolean, minLength: number, complexity: boolean) => Validators.compose([
  Validators.minLength(minLength),
  ...complexityValidators(complexity),
  ...requiredValidators(required)
]);
