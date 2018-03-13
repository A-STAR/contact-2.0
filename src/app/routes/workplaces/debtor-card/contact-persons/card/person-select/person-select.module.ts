import { NgModule } from '@angular/core';

import { PersonSelectGridModule } from './grid/person-select-grid.module';
import { PersonSelectCardModule } from './card/person-select-card.module';
import { PersonSelectDialogModule } from './dialog/person-select-dialog.module';

import { PersonSelectService } from './person-select.service';

@NgModule({
  imports: [
    PersonSelectGridModule,
    PersonSelectCardModule,
    PersonSelectDialogModule,
  ],
  exports: [
    PersonSelectGridModule,
    PersonSelectCardModule,
    PersonSelectDialogModule,
  ],
  providers: [
    PersonSelectService,
  ]
})
export class PersonSelectModule { }
