import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-height' },
  selector: 'app-route-ui-areas',
  templateUrl: './areas.component.html'
})
export class AreasComponent {}
