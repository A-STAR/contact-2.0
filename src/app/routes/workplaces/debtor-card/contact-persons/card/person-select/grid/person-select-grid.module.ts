import { NgModule } from '@angular/core';

import { PersonSelectDialogModule } from '../dialog/person-select-dialog.module';
import { SharedModule } from '@app/shared/shared.module';

import { PersonSelectGridComponent } from './person-select-grid.component';

@NgModule({
  imports: [
    PersonSelectDialogModule,
    SharedModule,
  ],
  exports: [
    PersonSelectGridComponent,
  ],
  declarations: [
    PersonSelectGridComponent,
  ],
})
export class PersonSelectGridModule { }
