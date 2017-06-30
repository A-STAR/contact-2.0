import { Component, ElementRef, EventEmitter, HostListener, Input, Output, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import createAutoCorrectedDatePipe from 'text-mask-addons/dist/createAutoCorrectedDatePipe';

@Component({
  selector: 'app-input-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss']
})
export class DatePickerComponent implements OnInit, OnDestroy {
  @Input() controlName: string;
  @Input() form: FormGroup;
  @Input() language = 'en';
  @Input() name: string;
  @Input() value: string;
  @Output() valueChange = new EventEmitter<string>();
  @ViewChild('input') input: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  isExpanded = false;

  dropdownStyle = {};

  dateFormat = 'dd.mm.yy';

  locale = {};

  mask = {
    mask: [/\d/, /\d/, '.', /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/],
    pipe: createAutoCorrectedDatePipe('dd.mm.yyyy'),
    keepCharPositions: true
  };

  private wheelListener: Function;

  private locales = {
    ru: {
      // 0 = Sunday, 1 = Monday, etc.
      firstDayOfWeek: 1,
      dayNames: ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'],
      dayNamesShort: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
      monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
      monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек']
    },
    en: {
      firstDayOfWeek: 1,
      dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
      dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
      ],
      monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }
  };

  constructor(
    private translateService: TranslateService,
    private renderer: Renderer2
  ) {
    if (this.controlName && this.name) {
      throw new SyntaxError('Please pass either [name] or [controlName] parameter, but not both.');
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.dropdown.nativeElement.contains(event.target) && !this.trigger.nativeElement.contains(event.target)) {
      this.toggleCalendar(false);
    }
  };

  ngOnInit(): void {
    if (this.controlName && this.form.get(this.controlName).value) {
      this.value = this.form.get(this.controlName).value;
    }

    this.language = this.translateService.currentLang;
    this.locale = this.locales[this.language];

    document.body.appendChild(this.dropdown.nativeElement);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.dropdown.nativeElement);
  }

  onValueChange(newValue: string): void {
    this.value = newValue;
    this.valueChange.emit(newValue);
  }

  onDateChange(newValue: Date): void {
    const d = newValue.getDate();
    const m = newValue.getMonth() + 1;
    const y = newValue.getFullYear();
    const date = `${d > 9 ? d : '0' + d}.${m > 9 ? m : '0' + m}.${y}`;

    if (this.form) {
      if (this.controlName) {
        this.form.patchValue({ [this.controlName]: date });
      }
      this.form.markAsDirty();
    }

    this.onValueChange(date);
    this.toggleCalendar(false);
  }

  get date(): string {
    return this.value || null;
  }

  toggleCalendar(isExpanded: boolean = false): void {
    // this.isExpanded = isExpanded === undefined ? !this.isExpanded : isExpanded;
    this.isExpanded = isExpanded;
    if (this.isExpanded) {
      // TODO: is there a better way to do this?
      setTimeout(() => this.positionDropdown(), 0);
    }

    if (this.dropdown.nativeElement.children[0] && !this.isExpanded) {
      this.removeWheelListener();
    }
  }

  private positionDropdown(): void {
    const inputRect: ClientRect = this.input.nativeElement.getBoundingClientRect();
    const contentRect: ClientRect = this.dropdown.nativeElement.children[0].getBoundingClientRect();

    // If the dropdown won't fit into the window below the input - place it above it.
    const top = inputRect.bottom + contentRect.height > window.innerHeight ? inputRect.top - contentRect.height : inputRect.bottom;
    const left = inputRect.left;

    this.dropdownStyle = {
      top: `${top}px`,
      left: `${left}px`
    };

    this.addWheelListener();
  }

  private addWheelListener(): void {
    this.wheelListener = this.renderer.listen(document, 'wheel', () => {
      this.toggleCalendar(false);
    });
  }

  private removeWheelListener(): void {
    if (this.wheelListener) {
      this.wheelListener();
    }
  }
}
