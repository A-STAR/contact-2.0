import { Validators } from '@angular/forms';

import { hasLowerCaseChars } from './hasLowerCaseChars';
import { hasUpperCaseChars } from './hasUpperCaseChars';

const complexityValidators = complex => complex ? [
  Validators.pattern(/\d/),
  hasLowerCaseChars,
  hasUpperCaseChars,
] : [];

export const password = (minLength: number, complexity: boolean) => Validators.compose([
  Validators.minLength(minLength),
  ...complexityValidators(complexity)
]);
