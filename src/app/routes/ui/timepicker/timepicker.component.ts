import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-timepicker',
  templateUrl: './timepicker.component.html'
})
export class TimePickerComponent {
  formGroup = new FormGroup({
    time1: new FormControl(),
    time2: new FormControl(new Date()),
  });
}
