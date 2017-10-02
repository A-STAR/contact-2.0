import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridTreeModule } from '../gridtree/gridtree.module';

import { GridTreeWrapperComponent } from './gridtree-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    GridTreeModule,
  ],
  exports: [
    GridTreeWrapperComponent,
  ],
  declarations: [
    GridTreeWrapperComponent,
  ]
})
export class GridTreeWrapperModule { }
