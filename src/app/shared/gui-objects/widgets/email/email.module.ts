import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailCardModule } from './card/email-card.module';
import { EmailGridModule } from './grid/email-grid.module';

import { EmailService } from './email.service';

@NgModule({
  imports: [
    EmailCardModule,
    EmailGridModule,
    CommonModule,
  ],
  exports: [
    EmailCardModule,
    EmailGridModule,
  ],
  providers: [
    EmailService,
  ]
})
export class EmailModule { }
