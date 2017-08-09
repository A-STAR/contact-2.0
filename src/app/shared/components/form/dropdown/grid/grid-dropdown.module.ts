import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownModule } from '../../../dropdown/dropdown.module';
import { GridModule } from '../../../grid/grid.module';

import { GridDropdownComponent } from './grid-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    GridModule,
  ],
  exports: [
    GridDropdownComponent,
  ],
  declarations: [
    GridDropdownComponent,
  ],
})
export class GridDropdownModule { }
