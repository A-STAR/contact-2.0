import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ReportCardComponent } from './report-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [
    ReportCardComponent,
  ],
  exports: [
    ReportCardComponent,
  ]
})
export class ReportCardModule { }
