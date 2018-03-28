import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObjectsGridModule } from './grid/objects-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { ObjectsService } from './objects.service';

import { ObjectsGridComponent } from './grid/objects-grid.component';

const routes: Routes = [
  {
    path: '',
    component: ObjectsGridComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    ObjectsGridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  providers: [ ObjectsService ],
})
export class ObjectsModule { }
