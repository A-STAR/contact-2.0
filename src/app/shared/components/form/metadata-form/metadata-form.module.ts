import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { InputModule } from '../input/input.module';

import { MetadataFormComponent } from './metadata-form.component';

@NgModule({
  declarations: [
    MetadataFormComponent,
  ],
  exports: [
    MetadataFormComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputModule,
  ],
})
export class MetadataFormModule {}
