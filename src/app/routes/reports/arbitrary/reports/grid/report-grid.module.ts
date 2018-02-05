import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ReportGridComponent } from './report-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    ReportGridComponent,
  ],
  declarations: [
    ReportGridComponent,
  ]
})
export class ReportGridModule { }
