import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmploymentCardModule } from './card/card.module';
import { EmploymentGridModule } from './grid/grid.module';

import { EmploymentService } from './employment.service';

@NgModule({
  imports: [
    EmploymentCardModule,
    EmploymentGridModule,
    CommonModule,
  ],
  exports: [
    EmploymentCardModule,
    EmploymentGridModule,
  ],
  providers: [
    EmploymentService,
  ]
})
export class EmploymentModule { }
