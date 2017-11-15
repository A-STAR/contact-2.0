import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverviewComponent } from './overview.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    OverviewComponent,
  ],
  declarations: [
    OverviewComponent,
  ],
})
export class OverviewModule { }
