import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DialogModule } from '../../../../components/dialog/dialog.module';
import { PersonSelectCardModule } from '../card/person-select-card.module';

import { PersonSelectDialogComponent } from './person-select-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TranslateModule,
    PersonSelectCardModule,
  ],
  exports: [
    PersonSelectDialogComponent,
  ],
  declarations: [
    PersonSelectDialogComponent,
  ],
  entryComponents: [
    PersonSelectDialogComponent,
  ]
})
export class PersonSelectDialogModule { }
