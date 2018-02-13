import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatePickerComponent {
  formGroup = new FormGroup({
    date1: new FormControl(),
    date2: new FormControl(new Date()),
  });
}
