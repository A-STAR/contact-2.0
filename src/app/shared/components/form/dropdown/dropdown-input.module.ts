import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BasicDropdownComponent } from './basic/basic-dropdown.component';
import { GridDropdownComponent } from './grid/grid-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    BasicDropdownComponent,
    GridDropdownComponent,
  ],
  declarations: [
    BasicDropdownComponent,
    GridDropdownComponent,
  ],
})
export class DropdownInputModule { }
