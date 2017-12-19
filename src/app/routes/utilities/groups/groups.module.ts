import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { GroupCardModule } from './card/card.module';

import { GroupsComponent } from './groups.component';
import { GroupCardComponent } from './card/card.component';

const routes: Routes = [
  { path: '', component: GroupsComponent },
  { path: 'create', component: GroupCardComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    GroupCardModule,
  ],
  declarations: [
    GroupsComponent,
  ],
})
export class GroupsModule {}
