import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-route-ui',
  styleUrls: [ './ui.component.scss' ],
  templateUrl: './ui.component.html'
})
export class UIComponent {
  formGroup = new FormGroup({
    text1: new FormControl(''),
    text2: new FormControl('I am a text field'),
    text3: new FormControl({ value: 'I am a text field', disabled: true }),
    textarea1: new FormControl(''),
    textarea2: new FormControl('Hi there!\nI am a textarea.'),
    textarea3: new FormControl('Hi there!\nI am a textarea.'),
    textarea4: new FormControl('Hi there!\nI am a textarea.\nIt\'s good to have you here.\nYou\'re a nice person.'),
    textarea5: new FormControl('I am a textarea.\nHi there!'),
    textarea6: new FormControl({ value: 'I am a textarea.\nHi there!', disabled: true }),
    number1: new FormControl(null),
    number2: new FormControl(42),
    number3: new FormControl({ value: 42, disabled: true }),
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
