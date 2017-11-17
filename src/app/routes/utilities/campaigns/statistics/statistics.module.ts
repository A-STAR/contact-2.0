import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from '../../../../shared/shared.module';
import { ParticipantsModule } from '../../../../routes/utilities/campaigns/participants/participants.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    // RouterModule.forChild(routes),
  ],
  exports: [StatisticsComponent],
  declarations: [StatisticsComponent]
})
export class StatisticsModule { }
