import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { GroupDebtsService } from './group-debts.service';

import { GroupDebtsComponent } from './group-debts.component';

const routes: Routes = [
  {
    path: '',
    component: GroupDebtsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  providers: [ GroupDebtsService ],
  declarations: [GroupDebtsComponent]
})
export class GroupDebtsModule { }
