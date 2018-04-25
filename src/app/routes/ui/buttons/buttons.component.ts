import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-ui-buttons',
  templateUrl: './buttons.component.html'
})
export class ButtonsComponent {}
