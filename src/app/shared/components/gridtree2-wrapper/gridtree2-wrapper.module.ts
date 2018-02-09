import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridTree2Module } from '@app/shared/components/gridtree2/gridtree2.module';
import { GridTree2WrapperComponent } from '@app/shared/components/gridtree2-wrapper/gridtree2-wrapper.component';

@NgModule({
  imports: [
    CommonModule,
    GridTree2Module,
  ],
  exports: [
    GridTree2WrapperComponent,
  ],
  declarations: [
    GridTree2WrapperComponent,
  ]
})
export class GridTree2WrapperModule { }
