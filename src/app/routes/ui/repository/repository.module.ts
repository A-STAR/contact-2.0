import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { RepositoryComponent } from './repository.component';

const routes: Routes = [
  {
    path: '',
    component: RepositoryComponent,
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
    RepositoryComponent,
  ],
})
export class RepositoryModule {}
