import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IDynamicLayoutAttribute } from '../../interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-attribute',
  templateUrl: 'attribute.component.html'
})
export class AttributeComponent {
  @Input() attribute: IDynamicLayoutAttribute;
}
