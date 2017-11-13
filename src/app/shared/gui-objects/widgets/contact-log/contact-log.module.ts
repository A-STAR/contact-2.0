import { NgModule } from '@angular/core';

import { ContactLogDialogModule } from './dialog/contact-log-dialog.module';
import { ContactLogGridModule } from './grid/contact-log-grid.module';

import { ContactLogService } from './contact-log.service';

@NgModule({
  imports: [
    ContactLogDialogModule,
    ContactLogGridModule,
  ],
  exports: [
    ContactLogDialogModule,
    ContactLogGridModule,
  ],
  providers: [
    ContactLogService,
  ]
})
export class ContactLogModule { }
