import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicLayoutControl } from '../../interface';

import { FormService } from '../../services/form.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block; width: 100%;' },
  selector: 'app-dynamic-layout-control',
  templateUrl: 'control.component.html'
})
export class ControlComponent {
  @Input() control: IDynamicLayoutControl;

  constructor(
    private formService: FormService,
  ) {}

  get formGroup(): FormGroup {
    return this.formService.getFormGroup(this.control);
  }
}
