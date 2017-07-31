import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailGridModule } from './grid/email-grid.module';

@NgModule({
  imports: [
    EmailGridModule,
    CommonModule,
  ],
  exports: [
    EmailGridModule,
  ]
})
export class EmailModule { }
