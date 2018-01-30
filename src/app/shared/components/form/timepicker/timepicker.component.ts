import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
  HostListener,
  Input,
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
export class TimePickerComponent implements ControlValueAccessor, Validator {
  @Input() buttonClass = 'btn btn-default';
  @Input() inputClass = 'form-control';
  @Input() placeholder = 'default.date.placeholders.timepicker';
  @Input() required = false;
  @Input() showSeconds = false;

  @ViewChild('input') input: ElementRef;
  @ViewChild('trigger') trigger: ElementRef;
  @ViewChild('dropdown') dropdown: ElementRef;

  formattedTime = '';
  isDisabled = false;
  isExpanded = false;
  isValid = true;
  value: Date = null;
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
      this.toggleTimepicker(false);
    }
  }

  /**
   * ControlValueAccessor implementation
   */
  writeValue(value: string): void {
    this.value = typeof value === 'string'
      ? this.valueConverterService.fromLocalTime(value) as Date || null
      : value;
    this.updateFormattedTime();
    this.cdRef.markForCheck();
  }

  /**
   * ControlValueAccessor implementation
   */
  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  /**
   * ControlValueAccessor implementation
   */
  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.cdRef.markForCheck();
  }

  /**
   * Validator implementation
   */
  validate(): object {
    return this.isValid ? null : { timepicker: false };
  }

  onValueChange(time: string): void {
    if (this.isExpanded) {
      this.toggleTimepicker(false);
    }
    const newTime = this.timeFromInput(time);
    if (newTime === false) {
      this.isValid = false;
      this.setValue(null);
    } else {
      this.isValid = true;
      this.setValue(newTime);
      this.updateFormattedTime();
    }
    this.cdRef.markForCheck();
  }

  onBlur(): void {
    this.propagateTouch(true);
  }

  toggleTimepicker(isExpanded?: boolean): void {
    this.isExpanded = isExpanded === undefined ? !this.isExpanded : isExpanded;
    if (this.isExpanded) {
      this.positionDropdown();
    } else {
      this.propagateTouch(true);
    }
    this.cdRef.markForCheck();
  }

  private updateFormattedTime(): void {
    this.formattedTime = this.valueConverterService.toLocalTime(this.value) || '';
  }

  private setValue(value: Date): void {
    this.value = value;
    this.propagateChange(value);
  }

  private timeFromInput(time: string): Date | false {
    return this.valueConverterService.fromLocalTime(time);
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
