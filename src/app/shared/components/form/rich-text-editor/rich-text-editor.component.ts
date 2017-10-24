import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as Quill from 'quill';

@Component({
  selector: 'app-rich-text-editor',
  templateUrl: './rich-text-editor.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RichTextEditorComponent implements ControlValueAccessor, OnInit {
  @Input() toolbar: boolean;

  @Output() init = new EventEmitter<RichTextEditorComponent>();

  @ViewChild('editor') editor: ElementRef;

  private _value: string;
  private _quill: Quill;
  private _index = 0;
  private _isDisabled = false;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: this.toolbar
          ? [
              [ 'bold', 'italic', 'underline' ],
              [ { 'size': [ 'small', false, 'large', 'huge' ] } ],
              [ { 'color': [] } ],
            ]
          : null,
      },
      formats: this.toolbar ? undefined : [],
      theme: 'snow'
    });

    this.updateDisabled();

    this._quill.on('text-change', () => {
      const html = this.editor.nativeElement.children[0].innerHTML;
      const text = html === '<p><br></p>' ? null : html;
      this._value = text;
      this.onSelectionChange();
      this.propagateChange(text);
      this.cdRef.markForCheck();
    });

    this._quill.on('selection-change', () => {
      this.onSelectionChange();
    });

    this.init.emit(this);
  }

  writeValue(value: string): void {
    this._value = value;
    this._quill.pasteHTML(value);
    this.cdRef.markForCheck();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
  }

  setDisabledState(isDisabled: boolean): void {
    this._isDisabled = isDisabled;
    this.updateDisabled();
  }

  get value(): string {
    return this._value;
  }

  insert(value: string): void {
    this._quill.insertText(this._index, value);
  }

  private onSelectionChange(): void {
    const selection = this._quill.getSelection();
    if (selection) {
      this._index = selection.index;
    }
  }

  private updateDisabled(): void {
    if (!this._quill) {
      return;
    }
    if (this._isDisabled) {
      this._quill.disable();
    } else {
      this._quill.enable();
    }
  }

  private propagateChange: Function = () => {};
}
