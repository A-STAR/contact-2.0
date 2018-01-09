import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { ObjectGridEditModule } from './add/object-grid-add.module';
import { SelectModule } from '../../../../shared/components/form/select/select.module';
import { SharedModule } from '../../../../shared/shared.module';

import { ObjectsService } from './objects.service';

import { ObjectsComponent } from './objects.component';

const routes: Routes = [
  {
    path: '',
    component: ObjectsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    ObjectGridEditModule,
    RouterModule.forChild(routes),
    SelectModule,
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    ObjectsComponent,
  ],
  providers: [
    ObjectsService,
  ]
})
export class ObjectModule {}
