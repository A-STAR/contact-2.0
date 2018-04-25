import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout-template',
  templateUrl: 'template.component.html'
})
export class TemplateComponent {}
