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
  // Renderer2
} from '@angular/core';
import { ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, Validator } from '@angular/forms';

import { ValueConverterService } from '../../../../core/converter/value-converter.service';

@Component({
  selector: 'app-input-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => TimePickerComponent),
      multi: true,
    },
  ]
})
export class TimePickerComponent implements ControlValueAccessor, OnInit, OnDestroy, Validator {
  @Input() buttonClass = 'btn btn-default';
  @Input() inputClass = 'form-control';
  @Input() placeholder = 'default.date.datePicker.placeholder';
  @Input() required = false;
  @Input() showSeconds = false;

  @ViewChild('input') input: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  formattedDate = '';
  isDisabled = false;
  isExpanded = false;
  isValid = true;
  value: string = null;
  style = { top: '-1px', right: '0px' };

  constructor(
    private cdRef: ChangeDetectorRef,
    // private renderer: Renderer2,
    private valueConverterService: ValueConverterService,
  ) { }

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
    // document.body.removeChild(this.dropdown.nativeElement);
    // this.renderer.removeChild(document.body, this.dropdown.nativeElement);
  }

  writeValue(value: string): void {
    this.value = typeof value === 'string'
      ? this.valueConverterService.fromLocalTime(value) as string
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

  onValueChange(event: Date): void {
    if (this.isExpanded) {
      this.toggleCalendar(false);
    }

    const newTime = this.timeFromInput(event);
    if (newTime === false) {
      this.isValid = false;
      this.setValue(null);
    } else {
      this.isValid = true;
      this.setValue(newTime);
      this.updateFormattedDate();
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
  }

  private updateFormattedDate(): void {
    this.formattedDate = this.value || '';
  }

  private setValue(value: string): void {
    this.value = value;
    this.propagateChange(value);
  }

  private timeFromInput(date: Date): string | false {
    console.log('converted', this.valueConverterService.toLocalTime(date));
    return this.valueConverterService.toLocalTime(date) || false;
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
  }

}
