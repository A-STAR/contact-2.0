import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { EmploymentGridComponent } from './employment-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    EmploymentGridComponent,
  ],
  declarations: [
    EmploymentGridComponent,
  ]
})
export class EmploymentGridModule { }
