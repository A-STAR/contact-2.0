import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { ParticipantsAddComponent } from './participants-add/participants-add.component';
import { ParticipantsComponent } from './participants.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    ParticipantsAddComponent,
    ParticipantsComponent,
  ],
  declarations: [
    ParticipantsAddComponent,
    ParticipantsComponent,
  ],
})
export class ParticipantsModule {}
