import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { GroupEditModule } from './edit/edit.module';

import { GroupsComponent } from './groups.component';
import { GroupEditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: GroupsComponent },
  { path: 'create', component: GroupEditComponent },
  { path: ':groupId', component: GroupEditComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    GroupEditModule,
  ],
  declarations: [
    GroupsComponent,
  ],
})
export class GroupsModule {}
