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
import { first } from 'rxjs/operators/first';

import { IScriptEditorMetadata } from '@app/shared/components/form/script-editor/script-editor.interface';

import { ScriptEditorService } from '@app/shared/components/form/script-editor/script-editor.service';

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

  @Input() metadata: IScriptEditorMetadata[];
  @Input() options: any = {};
  @Input() isDisabled = false;

  theme = 'eclipse';
  mode = 'javascript';

  value: string;

  constructor(private scriptEditorService: ScriptEditorService) {
  }

  ngAfterViewInit(): void {
    this.scriptEditorService.createScriptEditorDefs(this.metadata)
      .pipe(first())
      .subscribe(defs => {
        this.editor.options = {
          enableTern: {
            defs,
            plugins: {
              doc_comment: {
                fullDocs: true
              }
            },
            useWorker: this.editor.getEditor().getSession().getUseWorker(),
            ...this.options
          },
          enableSnippets: true,
          enableBasicAutocompletion: true,
        };
        this.editor.getEditor().on('focus', () => this.propagateTouch());
      });
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

  onChange(value: string): void {
    this.value = value;
    this.propagateChange(value);
  }

  private propagateChange: Function = () => {};
  private propagateTouch: Function = () => {};
}
