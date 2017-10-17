import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SingleListComponent } from './single-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports: [
    SingleListComponent,
  ],
  declarations: [
    SingleListComponent,
  ],
})
export class SingleListModule { }
