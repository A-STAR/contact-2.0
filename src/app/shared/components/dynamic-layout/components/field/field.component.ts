import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IDynamicLayoutField } from '../../interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-field',
  templateUrl: 'field.component.html'
})
export class FieldComponent {
  @Input() field: IDynamicLayoutField;
}
