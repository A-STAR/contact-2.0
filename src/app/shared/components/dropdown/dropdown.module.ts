import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DropdownComponent } from './dropdown.component';
import { DropdownDirective } from './dropdown.directive';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    DropdownComponent,
    DropdownDirective,
  ],
  declarations: [
    DropdownComponent,
    DropdownDirective,
  ],
  providers: [],
})
export class DropdownModule { }
