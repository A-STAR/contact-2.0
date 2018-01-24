import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { GroupsComponent } from './groups.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all'
      },
      {
        path: 'all',
        loadChildren: './grid/group-grid.module#GroupGridModule'
      },
      {
        path: 'debts',
        loadChildren: './group-debts/group-debts.module#GroupDebtsModule',
      }
    ],
  },
  {
    path: 'all/create',
    loadChildren: './card/group-card.module#GroupCardModule',
  },
  {
    path: 'all/:groupId',
    loadChildren: './card/group-card.module#GroupCardModule',
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    GroupsComponent,
  ],
})
export class GroupsModule {}
