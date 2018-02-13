import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-datetimepicker',
  templateUrl: './datetimepicker.component.html'
})
export class DateTimePickerComponent {
  formGroup = new FormGroup({
    datetime1: new FormControl(),
    datetime2: new FormControl(new Date()),
  });
}
