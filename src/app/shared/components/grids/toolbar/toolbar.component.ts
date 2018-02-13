import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-toolbar',
  templateUrl: 'toolbar.component.html'
})
export class GridToolbarComponent {}
