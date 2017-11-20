import { NgModule } from '@angular/core';

import { ContactLogTabGridModule } from './grid/contact-log-tab-grid.module';
import { ContactLogCardModule } from './card/contact-log-card.module';

import { ContactLogService } from './contact-log.service';

@NgModule({
  imports: [
    ContactLogTabGridModule,
  ],
  exports: [
    ContactLogTabGridModule,
    ContactLogCardModule,
  ],
  providers: [
    ContactLogService,
  ]
})
export class ContactLogTabModule { }
