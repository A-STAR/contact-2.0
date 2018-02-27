import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { ContactLogGridModule } from '../grid/contact-log-grid.module';
import { DialogModule } from '@app/shared/components/dialog/dialog.module';

import { ContactLogDialogComponent } from './contact-log-dialog.component';

@NgModule({
  imports: [
    ContactLogGridModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    ContactLogDialogComponent,
  ],
  declarations: [
    ContactLogDialogComponent,
  ]
})
export class ContactLogDialogModule { }

