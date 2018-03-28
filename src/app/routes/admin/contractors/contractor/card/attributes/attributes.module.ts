import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Routes, RouterModule } from '@angular/router';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { AttributesComponent } from './attributes.component';

const routes: Routes = [
  {
    path: '',
    component: AttributesComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    RoutesSharedModule,
    SharedModule
  ],
  declarations: [
    AttributesComponent
  ],
  exports: [
    AttributesComponent
  ]
})
export class AttributesModule { }
