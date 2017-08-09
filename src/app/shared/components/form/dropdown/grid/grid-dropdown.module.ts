import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DropdownModule } from '../../../dropdown/dropdown.module';
import { GridModule } from '../../../grid/grid.module';

import { GridDropdownComponent } from './grid-dropdown.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    GridModule,
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
export class GridDropdownModule { }
