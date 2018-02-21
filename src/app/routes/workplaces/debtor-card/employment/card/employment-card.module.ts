import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { EmploymentCardComponent } from './employment-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    EmploymentCardComponent,
  ],
  declarations: [
    EmploymentCardComponent,
  ]
})
export class EmploymentCardModule { }
