import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepositoryModule as RepoModule } from '@app/core/repository/repository.module';
import { SharedModule } from '@app/shared/shared.module';

import { RepositoryComponent } from './repository.component';

import { User } from './entities/user';

const routes: Routes = [
  {
    path: '',
    component: RepositoryComponent,
  },
];

@NgModule({
  imports: [
    RepoModule.forRoot(),
    RepoModule.withEntity({
      entityClass: User,
      urls: [ '/users/{id}' ],
    }),
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
