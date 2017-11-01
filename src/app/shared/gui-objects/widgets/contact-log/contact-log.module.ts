import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContactLogGridModule } from './grid/contact-log-grid.module';
import { ContactLogCardModule } from './card/contact-log-card.module';

import { ContactLogService } from './contact-log.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    ContactLogGridModule,
    ContactLogCardModule,
  ],
  providers: [
    ContactLogService,
  ]
})
export class ContactLogModule { }
