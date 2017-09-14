import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { GridTreeComponent } from './gridtree.component';
import { GridTreeHeaderComponent } from './header/gridtree-header.component';
import { GridTreeRowGroupComponent } from './rowgroup/gridtree-rowgroup.component';
import { GridTreeViewportComponent } from './viewport/gridtree-viewport.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    GridTreeComponent,
    GridTreeHeaderComponent,
    GridTreeRowGroupComponent,
    GridTreeViewportComponent,
  ],
  declarations: [
    GridTreeComponent,
    GridTreeHeaderComponent,
    GridTreeRowGroupComponent,
    GridTreeViewportComponent,
  ]
})
export class GridTreeModule { }
