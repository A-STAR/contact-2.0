import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailGridModule } from './grid/email-grid.module';

import { EmailService } from './email.service';

@NgModule({
  imports: [
    EmailGridModule,
    CommonModule,
  ],
  exports: [
    EmailGridModule,
  ],
  providers: [
    EmailService,
  ]
})
export class EmailModule { }
