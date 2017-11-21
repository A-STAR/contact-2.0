import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FilterModule } from './filter/filter.module';
import { SharedModule } from '../../../../shared/shared.module';

import { GridComponent } from './grid.component';

@NgModule({
  imports: [
    CommonModule,
    FilterModule,
    SharedModule,
  ],
  exports: [
    GridComponent,
  ],
  declarations: [
    GridComponent,
  ],
})
export class GridModule { }
