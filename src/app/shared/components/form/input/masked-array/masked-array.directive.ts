import { Directive, Input, SimpleChanges, OnChanges, ElementRef } from '@angular/core';
import { range } from '@app/core/utils';
import { ISegmentedInputMask } from '../segmented-input/segmented-input.interface';
import { NgModel } from '@angular/forms';

@Directive({
  selector: '[appMaskedArray]',
  host: {
    '(keyup)': 'onInputChange($event)'
  },
})
export class MaskedArrayDirective implements OnChanges {

  private static readonly ALLOWED_KEYS = {
    main: [
      ...range(0, 9).map(String),
    ],
    actions: [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ],
  };

  private static defaultMask: Partial<ISegmentedInputMask> = {
    delimeter: ',',
    maxNumberLength: 4,
    maxNumbers: 5
  };

  @Input() appMaskedArray: ISegmentedInputMask;

  private _mask: ISegmentedInputMask;

  viewValue: string;
  modelValue: number[];

  constructor(
    public model: NgModel,
    public el: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.appMaskedArray && changes.appMaskedArray.currentValue) {
      this._mask = Object.assign(MaskedArrayDirective.defaultMask, this.appMaskedArray);
    } else {
      this._mask = null;
    }
  }

  onInputChange(event: KeyboardEvent): any {
    if (this._mask) {
      const { ctrlKey, key, target } = event;
      const { value, selectionEnd } = target as HTMLInputElement;
      const { main, actions } = MaskedArrayDirective.ALLOWED_KEYS;
      if (actions.includes(key)) {
        this.viewValue = this.formatViewValue(key, value, selectionEnd);
        this.model.valueAccessor.writeValue(this.viewValue);
      } else if (!main.includes(key) || !this.allowInput(value) && !ctrlKey) {
        event.preventDefault();
      } else {
        this.modelValue = this.getModelValue(value);
        this.model.viewToModelUpdate(this.modelValue);
      }

    }
  }

  private allowInput(value: string): boolean {
    const numbers = value.split(' ' + this._mask.delimeter);
    return numbers.length <= this._mask.maxNumbers &&
      numbers.every(n => n.length <= this._mask.maxNumberLength);
  }

  private getModelValue(value: string): number[] {
    return value.replace(/[\s]+/g, '').split(this._mask.delimeter).map(Number);
  }

  private formatViewValue(value: string, key: string, pos: number): string {
    switch (key) {
      case 'Backspace':
        //
      case 'Delete':
        //
      case 'ArrowLeft':
       //
       case 'ArrowRight':
       ///
       case 'Home':
       ///
       case 'End':
       ///
       default:
        ///
    }
    return value;
  }

}
