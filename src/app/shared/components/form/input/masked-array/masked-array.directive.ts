import { Directive, Input, SimpleChanges, OnChanges, ElementRef, Output, EventEmitter } from '@angular/core';
import { NgModel } from '@angular/forms';

import { ISegmentedInputMask } from '../segmented-input/segmented-input.interface';

import { range } from '@app/core/utils';

@Directive({
  selector: '[appMaskedArray]',
  host: {
    '(keydown)': 'onInputChange($event)'
  },
})
export class MaskedArrayDirective implements OnChanges {

  @Output() ngModelChange = new EventEmitter<number[]>();

  private static readonly ALLOWED_KEYS = {
    main: [
      ...range(0, 9).map(String),
    ],
    actions: [
      'Backspace',
      'Delete',
      'Space',
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
      const { ctrlKey, key, target, code } = event;
      const { value, selectionEnd } = target as HTMLInputElement;
      const { main, actions } = MaskedArrayDirective.ALLOWED_KEYS;
      if (actions.includes(code)) {
        this.viewValue = this.formatViewValue(code, value, selectionEnd);
        this.model.valueAccessor.writeValue(this.viewValue);
        this.modelValue = this.getModelValue(this.viewValue);
        this.ngModelChange.emit(this.modelValue);
      } else if (!main.includes(key) || !this.allowInput(value) && !ctrlKey) {
        event.preventDefault();
      } else {
        this.modelValue = this.getModelValue(value + key);
        this.ngModelChange.emit(this.modelValue);
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

  private formatViewValue(code: string, value: string, pos: number): string {
    switch (code) {
      case 'Space':
        value = value.slice(0, pos) + this._mask.delimeter + value.slice(pos);
        pos += 1;
        break;
      case 'Backspace':
        let newPos = pos;
        while ([this._mask.delimeter, ' '].includes(value.charAt(newPos - 1))) {
          newPos -= 1;
        }
        value = value.slice(0, newPos) + value.slice(pos);
        pos = newPos;
        break;
      case 'Delete':
        //
      case 'ArrowLeft':
       //
       case 'ArrowRight':
       ///
       case 'Home':
       ///
       pos = 0;
       break;
       case 'End':
       ///
       pos = value.length - 1;
       break;
       default:
        // do nothing
    }
    (this.el.nativeElement as HTMLInputElement).setSelectionRange(pos, pos);
    return value;
  }

}
