import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: [ './text-editor.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextEditorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextEditorComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() codeMode = false;
  @Input() height = 240;
  @Input() richTextMode = true;

  @Output() init = new EventEmitter<TextEditorComponent>();

  @ViewChild('editor') editor: ElementRef;

  constructor(
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.element.on('summernote.init', () => this.onInit());
    this.element.on('summernote.focus', () => this.onFocus());
    this.element.on('summernote.change', () => this.onChange());

    this.summernote({
      height: this.height,
      toolbar: this.richTextMode ? this.initToolbar() : null,
    });
  }

  ngOnDestroy(): void {
    this.summernote('destroy');
  }

  writeValue(value: string): void {
    this.summernote('reset');
    if (value) {
      this.summernote('code', value);
    }
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.summernote(isDisabled ? 'disable' : 'enable');
  }

  insertText(text: string): void {
    this.summernote('focus');
    this.summernote('restoreRange');
    this.summernote('insertText', text);
  }

  private initToolbar(): any {
    const toolbar = [
      [ 'style', [ 'bold', 'italic', 'underline' ] ],
      [ 'font', [ 'strikethrough', 'superscript', 'subscript' ] ],
      [ 'color', [ 'color' ] ],
      [ 'para', [ 'ul', 'ol' ] ],
      [ 'insert', [ 'table' ] ],
    ];

    if (this.codeMode) {
      toolbar.push([ 'misc', [ 'codeview' ] ]);
    }

    return toolbar;
  }

  private onInit(): void {
    this.init.emit(this);
  }

  private onFocus(): void {
    this.propagateTouch();
  }

  private onChange(): void {
    const text = this.elRef.nativeElement.querySelector('.note-editable').innerText.trim();
    const value = this.richTextMode && text !== ''
      ? this.summernote('code')
      : text;
    this.propagateChange(value);
    this.summernote('saveRange');
  }

  private get summernote(): any {
    return this.element.summernote.bind(this.element);
  }

  private get element(): any {
    return jQuery(this.editor.nativeElement);
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
