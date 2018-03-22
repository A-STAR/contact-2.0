import { NgModule } from '@angular/core';

import { ContactLogDialogModule } from './dialog/contact-log-dialog.module';
import { ContactLogDetailsModule } from './details/contact-log-details.module';
import { ContactLogGridModule } from './grid/contact-log-grid.module';

import { ContactLogService } from './contact-log.service';

@NgModule({
  imports: [
    ContactLogDetailsModule,
    ContactLogDialogModule,
    ContactLogGridModule,
  ],
  exports: [
    ContactLogDetailsModule,
    ContactLogDialogModule,
    ContactLogGridModule,
  ],
  providers: [
    ContactLogService,
  ]
})
export class ContactLogModule { }
