import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';

import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    OverviewComponent,
  ],
  declarations: [
    OverviewComponent,
  ],
})
export class OverviewModule { }
