import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { PersonSearchComponent } from './person-search.component';
import { PersonSearchFilterComponent } from '@app/routes/workplaces/shared/person-search/filter/person-search-filter.component';
import { PersonSearchGridComponent } from '@app/routes/workplaces/shared/person-search/grid/person-search-grid.component';

@NgModule({
  declarations: [
    PersonSearchComponent,
    PersonSearchFilterComponent,
    PersonSearchGridComponent,
  ],
  exports: [
    PersonSearchComponent,
  ],
  imports: [
    SharedModule,
  ],
})
export class PersonSearchModule {}
