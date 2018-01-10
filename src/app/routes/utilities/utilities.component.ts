import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-utilities',
  templateUrl: 'utilities.component.html'
})
export class UtilitiesComponent {}
