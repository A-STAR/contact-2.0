import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-datetimepicker',
  templateUrl: './datetimepicker.component.html'
})
export class DateTimePickerComponent {
  formGroup = new FormGroup({
    datetime1: new FormControl(),
    datetime2: new FormControl(new Date()),
    datetime3: new FormControl(new Date()),
    datetime4: new FormControl({ value: new Date(), disabled: true }),
  });

  minDateTime = moment().subtract(10, 'd').toDate();
  maxDateTime = moment().add(10, 'd').toDate();

  get errors(): any {
    return {
      datetime3: this.formGroup.get('datetime3').errors,
    };
  }
}
