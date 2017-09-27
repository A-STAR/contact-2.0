import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { ObjectGridComponent } from './object-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    ObjectGridComponent,
  ],
  declarations: [
    ObjectGridComponent,
  ],
  entryComponents: [
    ObjectGridComponent,
  ]
})
export class ObjectGridModule { }
