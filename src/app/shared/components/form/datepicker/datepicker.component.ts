import { Component, ElementRef, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

@Component({
  selector: 'app-input-datepicker',
  templateUrl: './datepicker.component.html',
  styles: [
    '.datepicker { display: inline-block; }',
    '.dropdown { position: fixed; margin-top: 10px; z-index: 5000; }'
  ]
})
export class DatePickerComponent implements OnInit, OnDestroy {
  @Input() controlName: string;
  @Input() name: string;
  @Input() value: string;
  @Input() form: any;
  @Output() valueChange = new EventEmitter();
  @ViewChild('input') input: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  isExpanded = false;

  dropdownStyle = {};

  mask = {
    mask: [/\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/],
    pipe: createAutoCorrectedDatePipe('yyyy-mm-dd'),
    keepCharPositions: true
  };

  locale = {
    firstDayOfWeek: 1,  // 0 = Sunday, 1 = Monday, etc.
    dayNames: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],
    dayNamesShort: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    dayNamesMin: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
  };

  constructor() {
    if (this.controlName && this.name) {
      throw new SyntaxError('Please pass either [name] or [controlName] parameter, but not both.');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.dropdown.nativeElement.contains(event.target) && !this.trigger.nativeElement.contains(event.target)) {
      this.toggleCalendar(false);
    }
  };

  @HostListener('document:scroll')
  onDocumentScroll() {
    this.toggleCalendar(false);
  }

  ngOnInit() {
    document.body.appendChild(this.dropdown.nativeElement);
  }

  ngOnDestroy() {
    document.body.removeChild(this.dropdown.nativeElement);
  }

  onValueChange(newValue: string) {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  onDateChange(newValue: Date) {
    const d = newValue.getDate();
    const m = newValue.getMonth() + 1;
    const y = newValue.getFullYear();
    const date = `${y}-${m > 9 ? m : '0' + m}-${d > 9 ? d : '0' + d}`;

    this.onValueChange(date);

    this.toggleCalendar(false);
  }

  get date() {
    return Date.parse(this.value) ? this.value : null;
  }

  toggleCalendar(isExpanded?: boolean) {
    this.isExpanded = isExpanded === undefined ? !this.isExpanded : isExpanded;
    if (this.isExpanded) {
      const position: ClientRect = this.input.nativeElement.getBoundingClientRect();
      this.dropdownStyle = {
        top: `${position.bottom}px`,
        left: `${position.left}px`
      };
    }
  }
}
