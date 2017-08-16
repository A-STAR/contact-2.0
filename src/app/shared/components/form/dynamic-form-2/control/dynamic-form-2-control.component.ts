import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormControl } from '../dynamic-form-2.interface';

@Component({
  selector: 'app-dynamic-form-2-control',
  templateUrl: './dynamic-form-2-control.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicForm2ControlComponent {
  @Input() control: IDynamicFormControl;
  @Input() parentFormGroup: FormGroup;
}
