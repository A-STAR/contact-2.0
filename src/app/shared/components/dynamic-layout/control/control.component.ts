import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { IDynamicLayoutControl } from '../dynamic-layout.interface';

import { ControlService } from '../control/control.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block; width: 100%;' },
  selector: 'app-dynamic-layout-control',
  templateUrl: 'control.component.html'
})
export class ControlComponent {
  @Input() control: IDynamicLayoutControl;

  constructor(
    private formService: ControlService,
  ) {}

  get formGroup(): FormGroup {
    return this.formService.getFormGroup(this.control);
  }
}
