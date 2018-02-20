import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-select',
  templateUrl: './select.component.html'
})
export class SelectComponent {}
