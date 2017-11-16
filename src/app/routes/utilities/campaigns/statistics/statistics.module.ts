import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [StatisticsComponent],
  declarations: [StatisticsComponent]
})
export class StatisticsModule { }
