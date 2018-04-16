import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';

import { SelectPersonService } from '../select-person.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pledge-card-select-person-grid',
  templateUrl: 'select-person-grid.component.html'
})
export class SelectPersonGridComponent {
  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;

  readonly rowCount$ = this.selectPersonService.response$.pipe(map(r => r && r.total));

  readonly rows$ = this.selectPersonService.response$.pipe(map(r => r && r.data));

  constructor(
    private selectPersonService: SelectPersonService,
  ) {}

  onRequest(): void {
    this.selectPersonService.filters = this.grid.getFilters();
    this.selectPersonService.params = this.grid.getRequestParams();
    this.selectPersonService.search();
  }
}
