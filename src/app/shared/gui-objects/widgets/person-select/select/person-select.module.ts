import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonSelectCardModule } from '../card/person-select-card.module';
import { PersonSelectGridModule } from '../grid/person-select-grid.module';
import { TabViewModule } from 'app/shared/components/layout/tabview/tabview.module';

import { PersonSelectComponent } from './person-select.component';

@NgModule({
  imports: [
    CommonModule,
    PersonSelectCardModule,
    PersonSelectGridModule,
    TabViewModule,
  ],
  exports: [
    PersonSelectComponent,
  ],
  declarations: [
    PersonSelectComponent,
  ],
  entryComponents: [
    PersonSelectComponent,
  ]
})
export class PersonSelectModule { }
