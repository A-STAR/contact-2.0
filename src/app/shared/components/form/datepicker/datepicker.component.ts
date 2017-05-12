import { Component, ElementRef, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

@Component({
  selector: 'app-input-datepicker',
  templateUrl: './datepicker.component.html',
  styles: [
    '.datepicker { display: inline-block; }',
    '.dropdown { position: fixed; margin-top: 10px; z-index: 20000; }'
  ]
})
export class DatePickerComponent implements OnInit, OnDestroy {
  @Input() controlName: string;
  @Input() name: string;
  @Input() value: string;
  @Input() form: FormGroup;
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('input') input: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  isExpanded = false;

  dropdownStyle = {};

  dateFormat = 'dd.mm.yy';

  mask = {
    mask: [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/],
    pipe: createAutoCorrectedDatePipe('dd.mm.yyyy'),
    keepCharPositions: true
  };

  locale = {
    firstDayOfWeek: 1,  // 0 = Sunday, 1 = Monday, etc.
    dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
    dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
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
    if (this.controlName && this.form.get(this.controlName).value) {
      this.value = this.form.get(this.controlName).value;
    }
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
    const date = `${d > 9 ? d : '0' + d}.${m > 9 ? m : '0' + m}.${y}`;

    if (this.controlName) {
      this.form.patchValue({ [this.controlName]: date });
    }

    this.form.markAsDirty();
    this.value = date;
    this.toggleCalendar(false);
  }

  get date() {
    return this.value || null;
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
