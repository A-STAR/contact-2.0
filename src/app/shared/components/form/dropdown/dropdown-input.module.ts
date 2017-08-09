import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridDropdownModule } from './grid/grid-dropdown.module';

@NgModule({
  imports: [
    CommonModule,
    GridDropdownModule,
  ],
  exports: [
    GridDropdownModule,
  ]
})
export class DropdownInputModule { }
