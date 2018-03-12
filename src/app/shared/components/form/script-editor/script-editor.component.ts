import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  Input,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { AceEditorComponent } from 'ng2-ace-editor';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import 'brace/theme/eclipse';
import 'brace/mode/java';

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
  @ViewChild(AceEditorComponent) editor: AceEditorComponent;

  @Input() options: any = {};
  @Input() isDisabled = false;

  theme = 'eclipse';
  mode = 'java';

  value: string;

  ngAfterViewInit(): void {
    this.editor.setOptions(this.options);
    this.editor.getEditor().on('focus', () => this.propagateTouch());
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
