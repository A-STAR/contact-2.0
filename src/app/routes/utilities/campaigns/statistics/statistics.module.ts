import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [StatisticsComponent],
  declarations: [StatisticsComponent]
})
export class StatisticsModule { }
