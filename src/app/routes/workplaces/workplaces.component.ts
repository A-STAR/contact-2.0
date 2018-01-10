import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-workplaces',
  templateUrl: 'workplaces.component.html'
})
export class WorkplacesComponent {}
