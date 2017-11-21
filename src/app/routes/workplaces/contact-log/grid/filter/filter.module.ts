import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';

import { FilterService } from './filter.service';

import { FilterComponent } from './filter.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    FilterComponent,
  ],
  declarations: [
    FilterComponent,
  ],
  providers: [
    FilterService,
  ],
})
export class FilterModule { }
