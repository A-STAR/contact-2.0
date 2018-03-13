import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { AreasComponent } from './areas.component';

const routes: Routes = [
  {
    path: '',
    component: AreasComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    AreasComponent,
  ],
})
export class AreasModule {}
