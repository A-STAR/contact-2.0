import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicFormModule } from '../../form/dynamic-form/dynamic-form.module';

import { MetadataFilterService } from './metadata-filter.service';

import { MetadataFilterComponent } from './metadata-filter.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
  ],
  exports: [
    MetadataFilterComponent,
  ],
  declarations: [
    MetadataFilterComponent,
  ],
  providers: [
    MetadataFilterService
  ]
})
export class MetadataFilterModule { }
