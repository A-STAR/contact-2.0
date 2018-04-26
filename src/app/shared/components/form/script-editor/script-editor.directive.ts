
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appScriptEditor]'
})
export class ScriptEditorDirective {

  private editor: any;
  private value: string;

  @Output() textChanged = new EventEmitter<any>();

  @Input()
  set options(value: any) {
    if (value) {
      this.initTern(value);
    }
  }

  @Input()
  set readOnly(value: boolean) {
    this.editor.setReadOnly(value);
  }

  @Input()
  set theme(value: string) {
    this.editor.setTheme(`ace/theme/${value}`);
  }

  @Input()
  set mode(value: string) {
    this.editor.getSession().setMode(`ace/mode/${value}`);
  }

  @Input()
  set text(value: string) {
    if (value === this.value) {
      return;
    }
    this.editor.setValue(value);
    this.editor.clearSelection();
    this.editor.focus();
  }

  constructor(private elementRef: ElementRef) {
    this.editor = this.createEditor();
  }

  getEditor(): any {
    return this.editor;
  }

  private createEditor(): any {
    const el = this.elementRef.nativeElement;
    el.classList.add('editor');

    const editor = (<any>window).ace.edit(el);

    editor.on('change', () => this.onTextChanged());

    return editor;
  }

  private initTern(options: any): void {
    (<any>window).ace.config.loadModule('ace/ext/tern', () => {
      this.editor.setOptions(options);
    });
  }

  private onTextChanged(): void {
    const newVal = this.editor.getValue();
    if (newVal !== this.value) {
      this.textChanged.emit(newVal);
      this.value = newVal;
    }
  }
}
