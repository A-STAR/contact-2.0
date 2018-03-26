import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { GridDropdownModule } from '@app/shared/components/form/dropdown/grid/grid-dropdown.module';

import { GridSelectService } from './grid-select.service';

import { GridSelectComponent } from './grid-select.component';

@NgModule({
  imports: [
    CommonModule,
    GridDropdownModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [ GridSelectService ],
  declarations: [ GridSelectComponent ],
  exports: [ GridSelectComponent ]
})
export class GridSelectModule { }
