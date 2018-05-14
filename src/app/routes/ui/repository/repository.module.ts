import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RepositoryModule as RepoModule } from '@app/core/repository/repository.module';
import { SharedModule } from '@app/shared/shared.module';

import { RepositoryComponent } from './repository.component';

import { User } from './entities/user';
import { Person } from '@app/routes/ui/repository/entities/person';
import { Debt } from '@app/routes/ui/repository/entities/debt';

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
    RepoModule.withEntity({
      entityClass: Person,
      urls: [ '/persons/{id}' ],
    }),
    RepoModule.withEntity({
      entityClass: Debt,
      urls: [ '/persons/{personId}/debts' ],
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
