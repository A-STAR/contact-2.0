import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { GridTreeComponent } from './gridtree.component';
import { GridTreeHeaderComponent } from './header/gridtree-header.component';
import { GridTreeRowComponent } from './row/gridtree-row.component';
import { GridTreeRowContentComponent } from './row-content/gridtree-row-content.component';
import { GridTreeViewportComponent } from './viewport/gridtree-viewport.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
  ],
  exports: [
    GridTreeComponent,
    GridTreeHeaderComponent,
    GridTreeRowComponent,
    GridTreeRowContentComponent,
    GridTreeViewportComponent,
  ],
  declarations: [
    GridTreeComponent,
    GridTreeHeaderComponent,
    GridTreeRowComponent,
    GridTreeRowContentComponent,
    GridTreeViewportComponent,
  ]
})
export class GridTreeModule { }
