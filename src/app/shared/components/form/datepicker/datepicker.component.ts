import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  Input,
  Output,
  OnInit,
  OnDestroy,
  ViewChild,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { ValueConverterService } from '../../../../core/converter/value/value-converter.service';

@Component({
  selector: 'app-input-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    }
  ]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() language = 'en';

  @ViewChild('input') input: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  isExpanded = false;

  dropdownStyle = {};

  dateFormat = 'dd.mm.yy';

  locale = {};

  value: Date = null;

  isDisabled = false;

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

  private propagateChange: Function = () => {};

  constructor(
    private translateService: TranslateService,
    private renderer: Renderer2,
    private ValueConverterService: ValueConverterService,
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.dropdown.nativeElement.contains(event.target) && !this.trigger.nativeElement.contains(event.target)) {
      this.toggleCalendar(false);
    }
  };

  ngOnInit(): void {
    this.language = this.translateService.currentLang;
    this.locale = this.locales[this.language];

    document.body.appendChild(this.dropdown.nativeElement);
  }

  ngOnDestroy(): void {
    document.body.removeChild(this.dropdown.nativeElement);
  }

  writeValue(value: Date): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(newValue: Date): void {
    if (this.isExpanded) {
      this.toggleCalendar(false);
    }

    if (newValue instanceof Date) {
      this.value = newValue;
    } else {
      this.ValueConverterService.formatDate(newValue);
    }

    this.propagateChange(this.value);
  }

  toggleCalendar(isExpanded?: boolean): void {
    this.isExpanded = isExpanded === undefined ? !this.isExpanded : isExpanded;
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
