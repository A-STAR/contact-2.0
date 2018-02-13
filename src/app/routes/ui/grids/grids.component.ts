import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-route-ui-grids',
  templateUrl: './grids.component.html'
})
export class GridsComponent {}
