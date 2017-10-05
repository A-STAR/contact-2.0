import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DropdownModule } from '../../dropdown/dropdown.module';

import { SegmentedInputComponent } from './segmented-input.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    SegmentedInputComponent,
  ],
  declarations: [
    SegmentedInputComponent,
  ],
})
export class SegmentedInputModule { }
