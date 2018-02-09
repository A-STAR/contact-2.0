import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-number',
  templateUrl: './number.component.html'
})
export class NumberComponent {
  formGroup = new FormGroup({
    number1: new FormControl(null),
    number2: new FormControl(42),
    number3: new FormControl(42),
    number4: new FormControl(5),
    number5: new FormControl({ value: 42, disabled: true }),
  });

  get errors(): any {
    return this.formGroup.get('number4').errors;
  }
}
