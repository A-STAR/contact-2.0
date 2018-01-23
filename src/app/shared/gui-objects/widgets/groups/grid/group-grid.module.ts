import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes } from '@angular/router';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { GroupGridComponent } from './group-grid.component';

const routes: Routes = [
  {
    path: '',
    component: GroupGridComponent,
    data: {
      reuse: true,
    },
  },
];


@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    GroupGridComponent,
  ],
  declarations: [
    GroupGridComponent,
  ],
  entryComponents: [
    GroupGridComponent,
  ]
})
export class GroupGridModule { }
