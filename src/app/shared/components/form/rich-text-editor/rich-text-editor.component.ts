import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
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
  @Output() init = new EventEmitter<RichTextEditorComponent>();

  @ViewChild('editor') editor: ElementRef;

  private _value: string;
  private _quill: Quill;
  private _index = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    this._quill = new Quill(this.editor.nativeElement, {
      modules: {
        toolbar: [
          [ 'bold', 'italic', 'underline' ],
          [ { 'size': [ 'small', false, 'large', 'huge' ] } ],
          [ { 'color': [] } ],
        ]
      },
      theme: 'snow'
    });

    this._quill.on('text-change', () => {
      const html = this.editor.nativeElement.children[0].innerHTML;
      const text = html === '<p><br></p>' ? null : html;
      this._value = text;
      this.propagateChange(text);
      this.cdRef.markForCheck();
    });

    this._quill.on('selection-change', () => {
      const selection = this._quill.getSelection();
      if (selection) {
        this._index = selection.index;
      }
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

  get value(): string {
    return this._value;
  }

  insert(value: string): void {
    this._quill.insertText(this._index, value);
  }

  private propagateChange: Function = () => {};
}
