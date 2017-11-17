import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantsEditComponent } from './participants-edit/participants-edit.component';
import { ParticipantsComponent } from './participants.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [ParticipantsEditComponent, ParticipantsComponent],
  declarations: [ParticipantsEditComponent, ParticipantsComponent]
})
export class ParticipantsModule { }
