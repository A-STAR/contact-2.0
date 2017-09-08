import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { GridTreeComponent } from './gridtree.component';
import { GridTreeRowComponent } from './row/gridtree-row.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    GridTreeComponent,
    GridTreeRowComponent,
  ],
  declarations: [
    GridTreeComponent,
    GridTreeRowComponent,
  ]
})
export class GridTreeModule { }
