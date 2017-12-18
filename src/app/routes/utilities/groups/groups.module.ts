import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { GroupsComponent } from './groups.component';

const routes: Routes = [
  { path: '', component: GroupsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    GroupsComponent,
  ],
})
export class GroupsModule {}
