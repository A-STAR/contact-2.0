import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-radiobutton',
  templateUrl: './radiobutton.component.html'
})
export class RadioButtonComponent {
  formGroup = new FormGroup({
    radioGroup1: new FormControl(true),
    radioGroup2: new FormControl({ value: true, disabled: true }),
  });
}
