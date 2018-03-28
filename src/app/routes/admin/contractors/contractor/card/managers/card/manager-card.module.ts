import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ContractorsAndPortfoliosService } from '@app/routes/admin/contractors/contractors-and-portfolios.service';

import { ManagerCardComponent } from './manager-card.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerCardComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    ManagerCardComponent
  ],
  declarations: [
    ManagerCardComponent,
  ],
  providers: [ ContractorsAndPortfoliosService ],
})
export class ManagerCardModule {}
