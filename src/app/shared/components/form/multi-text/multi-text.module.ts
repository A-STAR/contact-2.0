import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectModule } from '../select/select.module';

import { MultiTextComponent } from './multi-text.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
  ],
  exports: [
    MultiTextComponent,
  ],
  declarations: [
    MultiTextComponent,
  ],
})
export class MultiTextModule { }
