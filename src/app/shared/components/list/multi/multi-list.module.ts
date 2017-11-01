import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MultiListComponent } from './multi-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    MultiListComponent,
  ],
  declarations: [
    MultiListComponent,
  ],
})
export class MultiListModule { }
