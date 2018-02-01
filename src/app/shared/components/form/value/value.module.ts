import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DateTimeModule } from '../datetime/datetime.module';
import { SelectModule } from '../select/select.module';

import { ValueInputComponent } from './value.component';

@NgModule({
  imports: [
    CommonModule,
    DateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  exports: [
    ValueInputComponent,
  ],
  declarations: [
    ValueInputComponent,
  ],
})
export class ValueInputModule { }
