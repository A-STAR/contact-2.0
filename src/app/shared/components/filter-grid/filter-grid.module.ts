import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ActionGridModule } from '../action-grid/action-grid.module';
import { GridFilterModule } from './filter/filter.module';

import { FilterGridService } from './filter-grid.service';

import { FilterGridComponent } from './filter-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ActionGridModule,
    GridFilterModule,
  ],
  exports: [
    FilterGridComponent,
  ],
  declarations: [
    FilterGridComponent,
  ],
  providers: [
    FilterGridService,
  ]
})
export class FilterGridModule { }
