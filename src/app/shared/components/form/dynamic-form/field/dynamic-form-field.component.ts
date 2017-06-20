import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import {
  IDynamicFormControl,
  ISelectedControlItemsPayload
} from '../dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
})
export class DynamicFormFieldComponent {

  @Input() control: IDynamicFormControl;
  @Input() form: FormGroup;

  @Output() selectedControlItemsChanges: EventEmitter<ISelectedControlItemsPayload>
    = new EventEmitter<ISelectedControlItemsPayload>();

  onSelectedControlItemsChanges(event: ISelectedControlItemsPayload): void {
    this.selectedControlItemsChanges.emit(event);
  }
}
