import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DropdownModule } from '../../../dropdown/dropdown.module';
import { GridsModule } from '../../../grids/grids.module';

import { GridDropdownComponent } from './grid-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    GridsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    GridDropdownComponent,
  ],
  declarations: [
    GridDropdownComponent,
  ],
})
export class GridDropdownModule {}
