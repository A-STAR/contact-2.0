import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { PledgeCardComponent } from './pledge-card.component';

const routes: Routes = [
  {
    path: '',
    component: PledgeCardComponent,
  }
];

@NgModule({
  declarations: [
    PledgeCardComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ]
})
export class PledgeCardModule {}
