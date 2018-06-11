import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { DropdownModule } from '@app/shared/components/dropdown/dropdown.module';
import { MassOpsModule } from '@app/shared/mass-ops/mass-ops.module';

import { ActionDropdownService } from '@app/shared/components/action-dropdown/action-dropdown.service';

import { ActionDropdownComponent } from './action-dropdown.component';

@NgModule({
  imports: [
    ButtonModule,
    CommonModule,
    DropdownModule,
    MassOpsModule
  ],
  exports: [
    ActionDropdownComponent,
  ],
  declarations: [
    ActionDropdownComponent,
  ],
  providers: [
    ActionDropdownService
  ]
})
export class ActionDropdownModule { }
