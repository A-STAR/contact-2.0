import { NgModule } from '@angular/core';

import { ContactLogDialogModule } from './dialog/contact-log-dialog.module';
import { ContactLogGridModule } from './grid/contact-log-grid.module';
import { ContactLogCardModule } from './card/contact-log-card.module';

import { ContactLogService } from './contact-log.service';

@NgModule({
  imports: [
    ContactLogDialogModule,
    ContactLogGridModule,
  ],
  exports: [
    ContactLogDialogModule,
    ContactLogGridModule,
    ContactLogCardModule,
  ],
  providers: [
    ContactLogService,
  ]
})
export class ContactLogModule { }
