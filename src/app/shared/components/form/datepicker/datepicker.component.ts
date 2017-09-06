import { Component, ElementRef, forwardRef, HostListener, Input, OnInit, OnDestroy, ViewChild, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

import { ValueConverterService } from '../../../../core/converter/value-converter.service';

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
  @Input() buttonClass = 'btn btn-default';
  @Input() inputClass = 'form-control';
  @Input() placeholder = 'default.date.datePicker.placeholder';
  @Input() maxDate: Date = null;
  @Input() minDate: Date = null;
  @Input() required = false;

  @ViewChild('input') input: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  locale = {};
  isDisabled = false;
  isExpanded = false;
  value: Date = null;
  style$ = new BehaviorSubject<{ top: string; left: string; }>(null);

  private subscription: Subscription;
  private wheelListener: Function;

  constructor(
    private renderer: Renderer2,
    private translateService: TranslateService,
    private valueConverterService: ValueConverterService,
  ) {
    this.subscription = Observable.merge(
      this.translateService.get('default.date')
        .take(1),
      this.translateService.onLangChange
        .distinctUntilChanged()
        .map(data => data.translations.default.date)
    ).subscribe((translations: any) => {
      const { days, months } = translations;
      this.locale = {
        firstDayOfWeek: 1,
        dayNames: days.full,
        dayNamesShort: days.short,
        dayNamesMin: days.short,
        monthNames: months.full,
        monthNamesShort: months.short
      };
    });
  }

  get formattedDate(): string {
    return this.valueConverterService.toLocalDate(this.value);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.dropdown.nativeElement.contains(event.target) && !this.trigger.nativeElement.contains(event.target) && this.isExpanded) {
      this.toggleCalendar(false);
    }
  };

  ngOnInit(): void {
    document.body.appendChild(this.dropdown.nativeElement);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    document.body.removeChild(this.dropdown.nativeElement);
  }

  writeValue(value: Date | string): void {
    this.value = typeof value === 'string'
      ? this.valueConverterService.fromISO(value as string)
      : value;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onValueChange(newValue: Date | Event): void {
    if (this.isExpanded) {
      this.toggleCalendar(false);
    }

    const newDate = newValue instanceof Date ?
      newValue :
      this.valueConverterService.fromLocalDate((newValue.target as HTMLInputElement).value);

    if (Number(newDate) !== Number(this.value)) {
      this.value = newDate;
      this.propagateChange(newDate);
    }
  }

  onBlur(): void {
    this.propagateTouch(true);
  }

  toggleCalendar(isExpanded?: boolean): void {
    this.isExpanded = isExpanded === undefined ? !this.isExpanded : isExpanded;
    if (this.isExpanded) {
      // TODO(d.maltsev): is there a better way to do this?
      setTimeout(() => this.positionDropdown(), 0);
    } else {
      this.propagateTouch(true);
    }

    if (this.dropdown.nativeElement.children[0] && !this.isExpanded) {
      this.removeWheelListener();
    }
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};

  private positionDropdown(): void {
    const inputRect: ClientRect = this.input.nativeElement.getBoundingClientRect();
    const contentRect: ClientRect = this.dropdown.nativeElement.children[0].getBoundingClientRect();

    // If the dropdown won't fit into the window below the input - place it above it.
    const top = inputRect.bottom + contentRect.height > window.innerHeight
      ? inputRect.top - contentRect.height
      : inputRect.bottom;
    const left = inputRect.left;

    this.style$.next({
      top: `${top}px`,
      left: `${left}px`
    });

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
