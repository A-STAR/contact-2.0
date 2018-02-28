import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormControl, ISelectItemsPayload } from '../dynamic-form.interface';

@Component({
  selector: 'app-dynamic-form-field',
  templateUrl: './dynamic-form-field.component.html',
  styleUrls: [ './dynamic-form-field.component.scss' ]
})
export class DynamicFormFieldComponent {

  @Input() control: IDynamicFormControl;
  @Input() form: FormGroup;

  @Output() onSelect = new EventEmitter<ISelectItemsPayload>();

  get isHidden(): boolean {
    return this.control.display === false;
  }

  selectHandler(event: ISelectItemsPayload): void {
    this.onSelect.emit(event);
    if (this.control.onChange) {
      this.control.onChange(event.items);
    }
  }
}
