import {
  Directive,
  Input,
  SimpleChanges,
  OnChanges,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';

import { ISegmentedInputMask } from '../segmented-input/segmented-input.interface';

import { range } from '@app/core/utils';

@Directive({
  selector: '[appMaskedArray]',
  host: {
    '(keydown)': 'onKeyDown($event)',
    '(paste)': 'onPaste($event)'
  },
})
export class MaskedArrayDirective implements OnChanges {

  @Output() ngModelChange = new EventEmitter<string>();

  private static readonly ALLOWED_KEYS = {
    main: [
      ...range(0, 9).map(String),
    ],
    aux: [
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
      'Backspace',
      'Delete',
    ],
    actions: [
      'Space',
    ],
  };

  private _value: string;

  @Input() appMaskedArray: ISegmentedInputMask;

  private _mask: ISegmentedInputMask;

  constructor(
    public el: ElementRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.appMaskedArray && changes.appMaskedArray.currentValue) {
      this._mask = this.appMaskedArray;
    } else {
      this._mask = null;
    }
  }

  onKeyDown(event: KeyboardEvent): void {
    if (this._mask) {
      const { ctrlKey, key, target, code } = event;
      const { value, selectionEnd } = target as HTMLInputElement;
      const { main, aux } = MaskedArrayDirective.ALLOWED_KEYS;
      if (this.isAction(code, key)) {
        this._value = this.formatViewValue(code, value, selectionEnd);
        this.el.nativeElement.value = this._value;
        event.preventDefault();
      } else if (main.includes(key)) {
        this._value = value + key;
      } else if (!ctrlKey && !aux.includes(key)) {
        event.preventDefault();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (this._mask && event.clipboardData) {
      event.preventDefault();
      const value = event.clipboardData.getData('Text');
      this._value = this.replaceValue(value);
      this.el.nativeElement.value = this._value;
      this.ngModelChange.emit(this._value);
    }
  }

  private isAction(code: string, key: string): boolean {
    return MaskedArrayDirective.ALLOWED_KEYS.actions.includes(code)
      || key === this._mask.delimeter;
  }

  private replaceValue(value: string): string {
    return value.match(/[\d]+(?=([\D])+)/g).join(`${this._mask.delimeter} `);
  }

  private formatViewValue(code: string, value: string, pos: number): string {
    switch (code) {
      case 'Space':
        const char = value.charAt(pos - 1);
        if (!(char === ' ' || char === this._mask.delimeter)) {
          value = value.slice(0, pos) + this._mask.delimeter + ' ' + value.slice(pos + 1);
          pos += 2;
        }
       break;
       // delimeter
      default:
        value = value.slice(0, pos) + ' ' + value.slice(pos);
        pos += 1;
        break;
    }
    (this.el.nativeElement as HTMLInputElement).setSelectionRange(pos, pos);
    return value;
  }

}
