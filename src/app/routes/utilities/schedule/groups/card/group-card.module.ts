import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { GroupsService } from '../groups.service';

import { GroupCardComponent } from './group-card.component';

const routes: Routes = [
  {
    path: '',
    component: GroupCardComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    TranslateModule,
    SharedModule
  ],
  exports: [
    GroupCardComponent,
  ],
  providers: [ GroupsService ],
  declarations: [
    GroupCardComponent,
  ]
})
export class GroupCardModule { }
