
import { OnInit, Directive, ElementRef, EventEmitter, Input, Output } from '@angular/core';

@Directive({
  selector: '[appAceEditor]'
})
export class AceEditorDirective implements OnInit {

  _text: string;
  _mode: string;
  _theme: string;
  _readOnly: boolean;
  _roptionseadOnly: boolean;
  editor: any;
  oldVal: any;

  @Output() textChanged = new EventEmitter<any>();
  @Output() editorRef = new EventEmitter<any>();


  @Input()
  set options(value: any) {
    this.editor.setOptions(value || {
      enableBasicAutocompletion: true,
      enableLiveAutocompletion: true
    });
  }

  @Input()
  set readOnly(value: boolean) {
    this._readOnly = value;
    this.editor.setReadOnly(value);
  }

  @Input()
  set theme(value: string) {
    this._theme = value || 'chrome';
    this.editor.setTheme(`ace/theme/${value}`);
  }

  @Input()
  set mode(value: string) {
    this._mode = value || 'javascript';
    this.editor.getSession().setMode(`ace/mode/${value}`);
  }

  @Input()
  set text(value: string) {
    if (value === this.oldVal) {
      return;
    }
    this.editor.setValue(value);
    this.editor.clearSelection();
    this.editor.focus();
  }

  constructor(elementRef: ElementRef) {
    const el = elementRef.nativeElement;
    el.classList.add('editor');
    this.editor = (<any>window).ace.edit(el);

    setTimeout(() => {
      this.editorRef.emit(this.editor);
    });
    this.editor.on('change', () => {
      const newVal = this.editor.getValue();
      if (newVal === this.oldVal) {
        return;
      }
      if (typeof this.oldVal !== 'undefined') {
        this.textChanged.emit(newVal);
      }
      this.oldVal = newVal;
    });
  }

  ngOnInit(): void {
    this.initTern(this.editor);
  }

  private initTern(editor: any): void {
    (<any>window).ace.config.loadModule('ace/ext/tern', () => {
        editor.setOptions({
            enableTern: {
                defs: [{
                  '!name': 'mylibrary',
                  'debt': {
                    'debtor': {
                      'fisrtName': 'string'
                    },
                    'payments': {
                      'amount': 'string',
                    }
                  },
                  'user': {
                    'login': 'string'
                  }
                }],
                plugins: {
                    doc_comment: {
                        fullDocs: true
                    }
                },
                useWorker: editor.getSession().getUseWorker(),
            },
            enableSnippets: true,
            enableBasicAutocompletion: true,
        });
    });
  }
}
