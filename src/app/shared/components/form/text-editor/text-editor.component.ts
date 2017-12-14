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
  @Input() height = 240;
  @Input() richTextMode = true;

  @Output() init = new EventEmitter<TextEditorComponent>();

  @ViewChild('editor') editor: ElementRef;

  private defaultToolbar = [
    [ 'style', [ 'bold', 'italic', 'underline' ] ],
    [ 'font', [ 'strikethrough', 'superscript', 'subscript' ] ],
    [ 'color', [ 'color' ] ],
    [ 'para', [ 'ul', 'ol' ] ],
    [ 'insert', [ 'table' ] ],
    [ 'misc', [ 'codeview' ] ]
  ];

  ngOnInit(): void {
    this.element.on('summernote.init', () => this.onInit());
    this.element.on('summernote.focus', () => this.onFocus());
    this.element.on('summernote.blur', () => this.onBlur());
    this.element.on('summernote.change', () => this.onChange());

    this.summernote({
      height: this.height,
      shortcuts: false,
      toolbar: this.richTextMode ? this.defaultToolbar : null,
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

  private onInit(): void {
    this.init.emit(this);
  }

  private onBlur(): void {
    this.summernote('saveRange');
  }

  private onFocus(): void {
    this.propagateTouch();
  }

  private onChange(): void {
    const code = this.summernote('code');
    // const value = this.richTextMode ? code : jQuery(code).text();
    const value = code;
    this.propagateChange(value);
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
