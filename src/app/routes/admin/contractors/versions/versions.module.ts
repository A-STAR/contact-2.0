import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { VersionsComponent } from './versions.component';

const routes: Routes = [
  {
    path: '',
    component: VersionsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    RoutesSharedModule,
    SharedModule
  ],
  declarations: [ VersionsComponent ],
  exports: [ VersionsComponent ]
})
export class VersionsModule { }
