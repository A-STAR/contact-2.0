import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from '../../../dropdown/dropdown.module';
import { ListModule } from '../../../list/list.module';

import { SingleSelectComponent } from './single-select.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownModule,
    FormsModule,
    ListModule,
  ],
  exports: [
    SingleSelectComponent,
  ],
  declarations: [
    SingleSelectComponent,
  ],
})
export class SingleSelectModule { }
