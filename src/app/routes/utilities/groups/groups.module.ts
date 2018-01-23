import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { GroupEditModule } from './edit/edit.module';

import { GroupsComponent } from './groups.component';
import { GroupEditComponent } from './edit/edit.component';

const routes: Routes = [
  {
    path: '',
    component: GroupsComponent,
    data: {
      reuse: true,
    },
    children: [
      // {
      //   path: '',
      //   pathMatch: 'full',
      //   redirectTo: 'all',
      // },
      {
        path: '',
        pathMatch: 'full',
        loadChildren:
          '@app/shared/gui-objects/widgets/groups/group.module#GroupModule',
      },
      {
        path: 'debtsInGroup',
        loadChildren:
          '@app/shared/gui-objects/widgets/debts-in-group/debts-in-group.module#DebtsInGroupModule',
      },
    ],
  },
  { path: 'create', component: GroupEditComponent },
  { path: ':groupId', component: GroupEditComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    GroupEditModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    GroupsComponent,
  ],
})
export class GroupsModule {}
