import { Validators } from '@angular/forms';

import { hasLowerCaseChars } from './hasLowerCaseChars';
import { hasUpperCaseChars } from './hasUpperCaseChars';

const hasDigitsLowerCaseAndUpperCaseChars = () => Validators.compose([
  Validators.pattern(/\d/),
  hasLowerCaseChars,
  hasUpperCaseChars,
]);

export const password = (minLength: number, complexity: boolean) => Validators.compose([
  Validators.minLength(minLength),
  complexity ? hasDigitsLowerCaseAndUpperCaseChars : undefined,
]);
