import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  // TODO(d.maltsev): rename to `app-grid`
  selector: 'app-client-grid',
  templateUrl: 'grid.component.html'
})
export class GridComponent {

}
