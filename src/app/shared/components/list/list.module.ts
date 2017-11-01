import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MultiListModule } from './multi/multi-list.module';
import { SingleListModule } from './single/single-list.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MultiListModule,
    SingleListModule,
  ],
  exports: [
    MultiListModule,
    SingleListModule,
  ],
})
export class ListModule { }
