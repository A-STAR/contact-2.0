
import { Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appScriptEditor]'
})
export class ScriptEditorDirective {

  private scriptEditorMode: string;
  private scriptEditor: any;
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
    this.scriptEditor.setReadOnly(value);
  }

  @Input()
  set theme(value: string) {
    this.scriptEditor.setTheme(`ace/theme/${value}`);
  }

  @Input()
  set mode(value: string) {
    this.scriptEditorMode = value;
    this.scriptEditor.getSession().setMode(`ace/mode/${value}`);
  }

  @Input()
  set text(value: string) {
    if (value === this.value) {
      return;
    }
    this.scriptEditor.setValue(value);
    this.scriptEditor.clearSelection();
    this.scriptEditor.focus();
  }

  constructor(private elementRef: ElementRef) {
    this.scriptEditor = this.createEditor();
  }

  get editor(): any {
    return this.scriptEditor;
  }

  private get ace(): any {
    return (<any>window).ace;
  }

  private get snippetManager(): any {
    return this.ace.require('ace/snippets').snippetManager;
  }

  private createEditor(): any {
    const el = this.elementRef.nativeElement;
    el.classList.add('editor');

    const editor = (<any>window).ace.edit(el);

    editor.on('change', () => this.onTextChanged());

    return editor;
  }

  private initTern(options: any): void {
    this.ace.config.loadModule('ace/ext/tern', () => {
      this.scriptEditor.setOptions(options);
      this.snippetManager.register(options.enableSnippets || [], this.scriptEditorMode);
    });
  }

  private onTextChanged(): void {
    const newVal = this.scriptEditor.getValue();
    if (newVal !== this.value) {
      this.textChanged.emit(newVal);
      this.value = newVal;
    }
  }
}
