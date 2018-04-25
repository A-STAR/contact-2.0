import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IDynamicLayoutControl } from '../../interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-control',
  templateUrl: 'control.component.html'
})
export class ControlComponent {
  @Input() control: IDynamicLayoutControl;
}
