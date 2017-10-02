import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SegmentedInputComponent } from './segmented-input.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    SegmentedInputComponent,
  ],
  declarations: [
    SegmentedInputComponent,
  ],
})
export class SegmentedInputModule { }
