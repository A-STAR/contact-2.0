import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../shared/shared.module';

import { DetailGridComponent } from './detail-grid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    DetailGridComponent,
  ],
  declarations: [
    DetailGridComponent,
  ],
  entryComponents: [
    DetailGridComponent,
  ]
})
export class DetailGridModule { }
