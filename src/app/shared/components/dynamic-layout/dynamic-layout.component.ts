import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-dynamic-layout',
  templateUrl: 'dynamic-layout.component.html'
})
export class DynamicLayoutComponent {}
