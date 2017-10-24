import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from '../../../dropdown/dropdown.module';
import { ListModule } from '../../../list/list.module';

import { MultiSelectComponent } from './multi-select.component';
import { MultiSelectWrapperComponent } from './multi-select-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ListModule,
  ],
  exports: [
    MultiSelectComponent,
    MultiSelectWrapperComponent,
  ],
  declarations: [
    MultiSelectComponent,
    MultiSelectWrapperComponent,
  ],
})
export class MultiSelectModule { }
