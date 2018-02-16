import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { GridsComponent } from './grids.component';

const routes: Routes = [
  {
    path: '',
    component: GridsComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    GridsComponent,
  ],
  exports: [
    RouterModule,
  ]
})
export class GridsModule {}
