import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { IdentityGridComponent } from './identity-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    IdentityGridComponent,
  ],
  declarations: [
    IdentityGridComponent,
  ],
})
export class IdentityGridModule { }
