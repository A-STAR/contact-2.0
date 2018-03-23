import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridDropdownModule } from './grid/grid-dropdown.module';
import { GridSelectModule } from './grid-select/grid-select.module';

@NgModule({
  imports: [
    CommonModule,
    GridDropdownModule,
    GridSelectModule,
  ],
  exports: [
    GridDropdownModule,
    GridSelectModule,
  ]
})
export class DropdownInputModule { }
