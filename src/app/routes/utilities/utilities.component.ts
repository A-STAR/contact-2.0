import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-utilities',
  templateUrl: 'utilities.component.html',
})
export class UtilitiesComponent {}
