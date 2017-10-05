import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from '../select/select.module';

import { ColorPickerComponent } from './colorpicker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  exports: [
    ColorPickerComponent,
  ],
  declarations: [
    ColorPickerComponent,
  ],
})
export class ColorPickerModule { }
