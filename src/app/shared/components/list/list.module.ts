import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ListComponent } from './list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    ListComponent,
  ],
  declarations: [
    ListComponent,
  ],
  providers: [],
})
export class ListModule { }
