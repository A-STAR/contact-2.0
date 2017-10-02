import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DropdownModule } from '../../dropdown/dropdown.module';

import { SegmentedInputComponent } from './segmented-input.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
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
