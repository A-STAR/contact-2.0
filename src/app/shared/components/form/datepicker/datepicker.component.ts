import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
  ViewChild,
  Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';
import { merge } from 'rxjs/observable/merge';
import { first } from 'rxjs/operators';

import { ValueConverterService } from '../../../../core/converter/value-converter.service';

@Component({
  selector: 'app-input-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => DatePickerComponent),
      multi: true,
    },
  ]
})
export class DatePickerComponent implements ControlValueAccessor, OnInit, OnDestroy, Validator {
  @Input() buttonClass = 'btn btn-default';
  @Input() inputClass = 'form-control';
  @Input() placeholder = 'default.date.placeholders.datepicker';
  @Input() maxDate: Date = null;
  @Input() minDate: Date = null;
  @Input() required = false;
  @Input() displayTime = false;

  @ViewChild('input') input: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  locale = {};
  formattedDate = '';
  isDisabled = false;
  isExpanded = false;
  isValid = true;
  value: Date = null;
  style = { top: '-1px', right: '0px' };

  private subscription: Subscription;
  private wheelListener: Function;

  constructor(
    private cdRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private translateService: TranslateService,
    private valueConverterService: ValueConverterService,
  ) {
    this.subscription = merge(
      this.translateService.get('default.date')
        .pipe(first()),
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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isExpanded && this.trigger
      && !this.dropdown.nativeElement.contains(event.target)
      && !this.trigger.nativeElement.contains(event.target)
    ) {
      this.toggleCalendar(false);
    }
  }

  ngOnInit(): void {
    // this.renderer.appendChild(document.body, this.dropdown.nativeElement);
    // document.body.appendChild(this.dropdown.nativeElement);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    // document.body.removeChild(this.dropdown.nativeElement);
    // this.renderer.removeChild(document.body, this.dropdown.nativeElement);
    this.removeWheelListener();
  }

  writeValue(value: Date | string): void {
    this.value = typeof value === 'string'
      ? this.valueConverterService.fromISO(value as string)
      : value;
    this.updateFormattedDate();
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdRef.markForCheck();
  }

  validate(): object {
    return this.isValid ? null : { datepicker: false };
  }

  onValueChange(newValue: Date | Event): void {
    if (this.isExpanded && !this.displayTime) {
      this.toggleCalendar(false);
    }

    const newDate = this.dateFromInput(newValue);
    if (newDate === false) {
      this.isValid = false;
      this.setValue(null);
    } else {
      this.isValid = true;
      if (Number(newDate) !== Number(this.value)) {
        this.setValue(newDate);
        this.updateFormattedDate();
      }
    }
    this.cdRef.markForCheck();
  }

  onBlur(): void {
    this.propagateTouch(true);
  }

  toggleCalendar(isExpanded?: boolean): void {
    this.isExpanded = isExpanded === undefined ? !this.isExpanded : isExpanded;
    if (this.isExpanded) {
      this.positionDropdown();
      this.cdRef.detectChanges();
    } else {
      this.propagateTouch(true);
    }
    // this.cdRef.markForCheck();

    if (this.dropdown.nativeElement.children[0] && !this.isExpanded) {
      this.removeWheelListener();
    }
  }

  private updateFormattedDate(): void {
    this.formattedDate = this.displayTime
      ? this.valueConverterService.toLocalDateTime(this.value)
      : this.valueConverterService.toLocalDate(this.value);
  }

  private setValue(value: Date): void {
    this.value = value;
    this.propagateChange(value);
  }

  private dateFromInput(value: any): Date | false {
    if (value instanceof Date) {
      return value;
    }

    const date = (value.target as HTMLInputElement).value;
    return this.displayTime ? this.valueConverterService.fromLocalDateTime(date) : this.valueConverterService.fromLocalDate(date);
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};

  private positionDropdown(): void {
    const inputRect: ClientRect = this.input.nativeElement.getBoundingClientRect();
    const content = this.dropdown.nativeElement.children[0];
    if (!content) {
      return;
    }
    const contentRect: ClientRect = content.getBoundingClientRect();

    // If the dropdown won't fit into the window below the input - place it above.
    const top = inputRect.bottom + contentRect.height > window.innerHeight
      ? inputRect.top - contentRect.height - 1
      : inputRect.bottom - 1;
    const right = inputRect.right;

    this.style = {
      top: `${top}px`,
      right: `${right}px`
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
