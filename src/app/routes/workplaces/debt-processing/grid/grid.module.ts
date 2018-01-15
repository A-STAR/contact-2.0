import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';

import { GridComponent } from './grid.component';

const routes: Routes = [
  {
    path: '',
    component: GridComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    GridComponent,
    RouterModule,
  ],
  declarations: [
    GridComponent,
  ],
})
export class GridModule {}
