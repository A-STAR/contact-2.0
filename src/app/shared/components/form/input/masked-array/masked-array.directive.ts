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
      'Tab',
      'Enter',
      // NOTE: delimeter can be different
      'Comma',
    ],
  };

  @Input() appMaskedArray: ISegmentedInputMask;

  private _mask: ISegmentedInputMask;

  private actionsRe = /[\s,]/;

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
        event.preventDefault();

        const result = this.formatViewValue(value, selectionEnd);
        this.update(result);

      } else if (main.includes(key)) {

        const prevChar = value.charAt(selectionEnd - 1);
        if (prevChar === this._mask.delimeter) {
          event.preventDefault();

          const result = this.handleInput(key, value, selectionEnd);
          this.update(result);
        }

      } else if (!ctrlKey && !aux.includes(key)) {
        event.preventDefault();
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    if (this._mask && event.clipboardData) {
      event.preventDefault();
      let value = event.clipboardData.getData('Text');
      value = this.replaceValue(value);
      this.el.nativeElement.value = value;
      this.ngModelChange.emit(value);
    }
  }

  private update(result: { value: string; pos: number; }): void {
    this.updateView(result.value, result.pos);
    this.ngModelChange.emit(result.value);
  }

  private isAction(code: string, key: string): boolean {
    return MaskedArrayDirective.ALLOWED_KEYS.actions.includes(code)
      || key === this._mask.delimeter;
  }

  private replaceValue(value: string): string {
    return value.match(/[\d]+(?=([\D])+)/g).join(`${this._mask.delimeter} `);
  }

  private handleInput(char: string, value: string, selectionEnd: number): { value: string, pos: number } {
    let pos = selectionEnd;
    value = this.insertCharsAt([' ', char], value, pos);
    pos += 2;
    const nextChar = value.charAt(pos);
    if (this.isActionChar(nextChar) && nextChar !== this._mask.delimeter) {
      value = this.insertCharsAt([this._mask.delimeter], value, pos);
    }
    return { pos, value };
  }

  private updateView(value: string, pos: number): void {
    this.el.nativeElement.value = value;
    (this.el.nativeElement as HTMLInputElement).setSelectionRange(pos, pos);
  }

  private formatViewValue(value: string, pos: number): { value: string, pos: number } {
    const prevChar = value.charAt(pos - 1);
    const char = value.charAt(pos);
    // look behind one char
    if (!this.isActionChar(prevChar)) {
      // look current char
      if (!this.isActionChar(char)) {
        return {
          value: this.insertCharsAt([this._mask.delimeter, ' '], value, pos),
          pos: pos + 2
        };
      }
      return { value, pos: pos + 2 };
    }
    if (!this.isActionChar(char) && prevChar === this._mask.delimeter) {
      return {
        value: this.insertCharsAt([' '], value, pos),
        pos: pos + 1
      };
    }
    return { value, pos };
  }

  private isActionChar(char: string): boolean {
    return this.actionsRe.test(char) || char === this._mask.delimeter;
  }

  private insertCharsAt(chars: string[], value: string, pos: number): string {
    return value.slice(0, pos) + chars.join('') + value.slice(pos);
  }

}
