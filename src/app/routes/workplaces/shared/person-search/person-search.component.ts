import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { PersonSearchService } from '@app/routes/workplaces/shared/person-search/person-search.service';

import { PersonSearchGridComponent } from './grid/person-search-grid.component';

import { Person } from '@app/entities';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  providers: [
    PersonSearchService,
  ],
  selector: 'app-person-search',
  templateUrl: 'person-search.component.html'
})
export class PersonSearchComponent {

  @ViewChild(PersonSearchGridComponent) grid: PersonSearchGridComponent;

  get person(): Person {
    return this.grid.selection[0];
  }
}
