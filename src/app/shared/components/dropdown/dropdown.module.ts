import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownComponent } from './dropdown.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DropdownComponent,
  ],
  declarations: [
    DropdownComponent,
  ],
  providers: [],
})
export class DropdownModule { }
