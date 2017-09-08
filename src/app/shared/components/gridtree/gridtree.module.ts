import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { GridTreeComponent } from './gridtree.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    GridTreeComponent,
  ],
  declarations: [
    GridTreeComponent,
  ]
})
export class GridTreeModule { }
