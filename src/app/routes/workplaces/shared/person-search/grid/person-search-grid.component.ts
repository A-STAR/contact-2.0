import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { map } from 'rxjs/operators';

import { PersonSearchService } from '@app/routes/workplaces/shared/person-search/person-search.service';

import { ActionGridComponent } from '@app/shared/components/action-grid/action-grid.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-search-grid',
  templateUrl: 'person-search-grid.component.html'
})
export class PersonSearchGridComponent {

  @ViewChild(ActionGridComponent) grid: ActionGridComponent<any>;

  readonly rowCount$ = this.personSearchService.response$.pipe(map(r => r && r.total));

  readonly rows$ = this.personSearchService.response$.pipe(map(r => r && r.data));

  constructor(
    private personSearchService: PersonSearchService,
  ) {}

  get selection(): any {
    return this.grid.selection;
  }

  onRequest(): void {
    this.personSearchService.filters = this.grid.getFilters();
    this.personSearchService.params = this.grid.getRequestParams();
    this.personSearchService.search();
  }
}
