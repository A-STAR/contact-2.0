import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IViewFormControl, IViewFormData } from './view-form.interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-view-form',
  templateUrl: './view-form.component.html',
})
export class ViewFormComponent {
  @Input() data: IViewFormData = {};
  @Input() controls: IViewFormControl[] = [];

  get items(): any {
    return this.controls.map(control => ({ control, value: this.data[control.name] }));
  }
}
