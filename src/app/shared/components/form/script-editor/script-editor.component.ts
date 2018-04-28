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

  @Input() metadata: IScriptEditorConfig[];
  @Input() options: any = {};
  @Input() isDisabled = false;

  theme = 'eclipse';
  mode = 'javascript';

  value: string;

  ngAfterViewInit(): void {
    this.editor.options = {
      enableTern: {
        defs: this.metadata,
        plugins: {
          doc_comment: {
            fullDocs: true
          }
        },
        useWorker: this.editor.editor.getSession().getUseWorker(),
        ...this.options
      },
      enableSnippets: [],
      enableBasicAutocompletion: true,
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
