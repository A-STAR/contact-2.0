import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-checkbox',
  templateUrl: './checkbox.component.html'
})
export class CheckboxComponent {
  formGroup = new FormGroup({
    checkbox1: new FormControl(false),
    checkbox2: new FormControl(true),
    checkbox3: new FormControl({ value: false, disabled: true }),
    checkbox4: new FormControl({ value: true, disabled: true }),
  });
}
