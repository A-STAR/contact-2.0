import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { IDynamicLayoutTemplate } from '../../interface';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-template',
  templateUrl: 'template.component.html'
})
export class TemplateComponent {
  @Input() template: IDynamicLayoutTemplate;
}
