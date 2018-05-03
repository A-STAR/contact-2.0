import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { ScriptEditorDirective } from './script-editor.directive';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { IScriptEditorConfig } from '@app/shared/components/form/script-editor/script-editor.interface';

@Component({
  selector: 'app-script-editor',
  templateUrl: './script-editor.component.html',
  styleUrls: [ './script-editor.component.scss' ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ScriptEditorComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScriptEditorComponent implements ControlValueAccessor, AfterViewInit {
  @ViewChild(ScriptEditorDirective) editor: ScriptEditorDirective;

  @Input() options: IScriptEditorConfig = {};
  @Input() isDisabled = false;

  theme = 'eclipse';
  mode = 'javascript';

  value: string;

  ngAfterViewInit(): void {
    this.editor.options = {
      enableBasicAutocompletion: true,
      enableSnippets: [{
        name: 'if',
        tabTrigger: 'if',
        content: 'if (${1:true}) {\n${0}\n}\n'
      }, {
        name: 'if ... else',
        tabTrigger: 'if',
        content: 'if (${1:true}) {\n${2}\n} else {\n${0}\n}\n'
      }, {
        name: 'switch',
        tabTrigger: 'switch',
        content: 'switch (${1:expression}) {\ncase \'${3:case}\':\n${4:// code}\nbreak;\n${5}\ndefault:\n${2:// code}\n}\n'
      }, {
        name: 'case',
        tabTrigger: 'case',
        content: 'case \'${1:case}\':\n${2:// code}\nbreak;\n${3}\n'
      }, {
        name: 'for',
        tabTrigger: 'for',
        content: 'for (${1:i} = 0; $1 < ${2:limit}; $1++) {\n${3:$2[$1]}$0\n}\n'
      }, {
        name: 'for collection',
        tabTrigger: 'for',
        content: 'for (${1:type} ${2:variable}: ${3:collection}) {\n${4:$2}$0\n}\n'
      }],
      ...(this.options || {}),
      enableTern: {
        plugins: {
          doc_comment: {
            fullDocs: true
          }
        },
        useWorker: this.editor.editor.getSession().getUseWorker(),
        ...(this.options.enableTern || {})
      }
    };

    this.editor.editor.on('focus', () => this.propagateTouch());
  }

  writeValue(value: string): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.propagateTouch = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  onChange(): void {
    this.propagateChange(this.value);
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
