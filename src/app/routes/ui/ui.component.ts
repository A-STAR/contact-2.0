import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui',
  styleUrls: [ './ui.component.scss' ],
  templateUrl: './ui.component.html'
})
export class UIComponent {
  formGroup = new FormGroup({
    checkbox1: new FormControl(false),
    checkbox2: new FormControl(true),
    checkbox3: new FormControl({ value: false, disabled: true }),
    checkbox4: new FormControl({ value: true, disabled: true }),
    radioGroup1: new FormControl(true),
    radioGroup2: new FormControl({ value: true, disabled: true }),
    datetime1: new FormControl(),
    datetime2: new FormControl(new Date()),
    date1: new FormControl(),
    date2: new FormControl(new Date()),
    time1: new FormControl(),
    time2: new FormControl(new Date()),
  });
}
