import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';

import { AllComponent } from './all.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    AllComponent,
  ],
  declarations: [
    AllComponent,
  ],
})
export class AllModule { }
