import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantsAddComponent } from './participants-add/participants-add.component';
import { ParticipantsComponent } from './participants.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ParticipantsAddComponent, ParticipantsComponent],
  declarations: [ParticipantsAddComponent, ParticipantsComponent]
})
export class ParticipantsModule { }
