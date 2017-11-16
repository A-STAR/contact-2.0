import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParticipantsEditComponent } from './participants-edit/participants-edit.component';
import { ParticipantsComponent } from './participants.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [ParticipantsEditComponent, ParticipantsComponent],
  declarations: [ParticipantsEditComponent, ParticipantsComponent]
})
export class ParticipantsModule { }
