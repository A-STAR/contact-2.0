import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';

import { ActionDropdownComponent } from './action-dropdown.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DropdownModule,
  ],
  exports: [
    ActionDropdownComponent,
  ],
  declarations: [
    ActionDropdownComponent,
  ],
})
export class ActionDropdownModule { }
