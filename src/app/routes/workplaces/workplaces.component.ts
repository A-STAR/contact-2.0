import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-route-workplaces',
  templateUrl: 'workplaces.component.html',
})
export class WorkplacesComponent {}
