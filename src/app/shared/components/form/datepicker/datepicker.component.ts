import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-input-datepicker',
  templateUrl: './datepicker.component.html'
})
export class DatePickerComponent {
  @Input() controlName: string;
  @Input() name: string;
  @Input() value: string;
  @Input() form: any;
  @Output() valueChange = new EventEmitter();

  options = {
    dayLabels: {mo: 'Пн', tu: 'Вт', we: 'Ср', th: 'Чт', fr: 'Пт', sa: 'Сб', su: 'Вс'},
    monthLabels: [0, 'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dateFormat: 'dd-mm-yyyy',
    todayBtnTxt: 'Сегодня',
    firstDayOfWeek: 'mo',
    minYear: 1900,
    showWeekNumbers: true
  };

  constructor() {
    if (this.controlName && this.name) {
      throw new SyntaxError('Please pass either [name] or [controlName] parameter, but not both.');
    }
  }

  onValueChange(newValue) {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }
}
