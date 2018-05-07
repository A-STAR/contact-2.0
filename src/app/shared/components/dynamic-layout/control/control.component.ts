import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { IDynamicLayoutControl, IDynamicLayoutGridSelectControl } from '../dynamic-layout.interface';

import { ControlService } from '../control/control.service';
import { DynamicLayoutService } from '../dynamic-layout.service';
import { EventService } from '../event/event.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: block; width: 100%;' },
  selector: 'app-dynamic-layout-control',
  styleUrls: [ './control.component.scss' ],
  templateUrl: './control.component.html'
})
export class ControlComponent {
  @Input() control: IDynamicLayoutControl;

  constructor(
    private controlService: ControlService,
    private dynamicLayoutService: DynamicLayoutService,
    private eventService: EventService,
    private translateService: TranslateService,
  ) {}

  get formGroup(): FormGroup {
    return this.controlService.getFormGroup(this.control);
  }

  isRequired(control: IDynamicLayoutControl): Observable<boolean> {
    return this.dynamicLayoutService.getItem(control.uid).streams.validators.required;
  }

  onGridSelect(control: IDynamicLayoutGridSelectControl, event: any): void {
    this.eventService.onGridSelect(control, event);
  }

  getErrorMessage(control: IDynamicLayoutControl): string {
    const formGroup = this.controlService.getFormGroup(control);
    const c = formGroup.get(control.name);
    return c.errors && Object.keys(c.errors).length && (c.touched || c.dirty)
      ? this.getErrorMessageForControl(c)
      : null;
  }

  private getErrorMessageForControl(control: AbstractControl): string {
    const first = Object.keys(control.errors)[0];
    const message = ControlService.DEFAULT_MESSAGES[first] || first;
    const params = control.errors[first];
    return this.translateService.instant(message, params);
  }
}
