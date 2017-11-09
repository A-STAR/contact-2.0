import { NgModule } from '@angular/core';

import { ContactLogGridModule } from './grid/contact-log-grid.module';

import { ContactLogService } from './contact-log.service';

@NgModule({
  imports: [
    ContactLogGridModule,
  ],
  exports: [
    ContactLogGridModule,
  ],
  providers: [
    ContactLogService,
  ]
})
export class ContactLogModule { }
