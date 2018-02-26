import { NgModule } from '@angular/core';

import { PersonSelectCardModule } from '../card/person-select-card.module';
import { SharedModule } from '@app/shared/shared.module';

import { PersonSelectDialogComponent } from './person-select-dialog.component';

@NgModule({
  imports: [
    PersonSelectCardModule,
    SharedModule,
  ],
  exports: [
    PersonSelectDialogComponent,
  ],
  declarations: [
    PersonSelectDialogComponent,
  ],
})
export class PersonSelectDialogModule { }
