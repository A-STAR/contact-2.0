import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
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

  @Input()
  set richTextMode(richTextMode: boolean) {
    this._richTextMode = richTextMode;

    if (this.isInitialized) {
      this.destroyEditor();
      this.initEditor();

      // No idea why but without checking for disabled state a nasty bug occurs:
      // If the control is disabled and its mode is plain text the value is not displayed most of the time.
      if (!this.isDisabled) {
        const text = this.elRef.nativeElement.querySelector('.note-editable').innerText.trim();
        if (!richTextMode) {
          this.summernote('reset');
          this.summernote('code', text);
        }
        this.propagateChange(text);
      }
    }
  }

  @Output() init = new EventEmitter<TextEditorComponent>();

  @ViewChild('editor') editor: ElementRef;

  private cachedValue: string;
  private isDisabled = false;
  private _richTextMode = true;
  private isInitialized = false;

  constructor(
    private elRef: ElementRef,
  ) {}

  ngOnInit(): void {
    this.initEditor();
  }

  ngOnDestroy(): void {
    this.destroyEditor();
  }

  writeValue(value: string): void {
    this.cachedValue = value;
    this.writeValueHandler();
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
    this.summernote(isDisabled ? 'disable' : 'enable');
  }

  insertText(text: string): void {
    this.summernote('focus');
    this.summernote('restoreRange');
    this.summernote('insertText', text);
  }

  @HostListener('keydown')
  @HostListener('mousedown')
  onCursorChange(): void {
    // This is obvously not optimal
    // A better solution would be to save range on blur,
    // but summernote focuses automatically on range save, which would make blur impossible
    setTimeout(() => this.summernote('saveRange'), 0);
  }

  private writeValueHandler(): void {
    this.summernote('reset');
    if (this.cachedValue) {
      this.summernote('code', this.cachedValue);
    }
  }

  private initEditor(): void {
    this.summernote({
      height: this.height,
      toolbar: this._richTextMode ? this.initToolbar() : null,
      callbacks: {
        onInit: () => this.onInit(),
        onFocus: () => this.propagateTouch(),
        onChange: () => this.onChange(),
      }
    });
    this.summernote(this.isDisabled ? 'disable' : 'enable');
  }

  private destroyEditor(): void {
    this.summernote('destroy');
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
    this.writeValueHandler();
    this.cachedValue = null;
    this.isInitialized = true;
    this.init.emit(this);
  }

  private onChange(): void {
    const text = this.elRef.nativeElement.querySelector('.note-editable').innerText.trim();
    const value = this._richTextMode && text !== ''
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
