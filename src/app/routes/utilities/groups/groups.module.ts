import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupGridModule } from '@app/routes/utilities/groups/grid/group-grid.module';
import { GroupCardModule } from '@app/routes/utilities/groups/card/group-card.module';
import { GroupDebtsModule } from '@app/routes/utilities/groups/group-debts/group-debts.module';
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
        loadChildren:
          './grid/group-grid.module#GroupGridModule',
      },
      {
        path: 'debts',
        loadChildren:
          './group-debts/group-debts.module#GroupDebtsModule',
      },
    ],
  },
  { path: 'create', loadChildren: './card/group-card.module#GroupCardModule', },
  { path: ':groupId', loadChildren: './card/group-card.module#GroupCardModule', }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    GroupCardModule,
    GroupDebtsModule,
    GroupGridModule,
  ],
  declarations: [
    GroupsComponent,
  ],
})
export class GroupsModule {}
