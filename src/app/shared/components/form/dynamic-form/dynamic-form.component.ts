import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicFormControl } from './dynamic-form-control.interface';

@Component({
  selector: 'app-dynamic-form',
  templateUrl: 'dynamic-form.component.html'
})

export class DynamicFormComponent {
  @Input() form: FormGroup;
  @Input() controls: Array<IDynamicFormControl>;
}

