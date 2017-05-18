import { Validators } from '@angular/forms';

import { hasLowerCaseChars } from './hasLowerCaseChars';
import { hasUpperCaseChars } from './hasUpperCaseChars';
import { hasDigits } from './hasDigits';

const complexityValidators = complex => complex ? [
  hasDigits,
  hasLowerCaseChars,
  hasUpperCaseChars,
] : [];

export const password = (minLength: number, complexity: boolean) => Validators.compose([
  Validators.minLength(minLength),
  ...complexityValidators(complexity)
]);
