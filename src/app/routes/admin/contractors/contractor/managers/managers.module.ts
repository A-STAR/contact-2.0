
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { ContractorsAndPortfoliosService } from '@app/routes/admin/contractors/contractors-and-portfolios.service';

import { ManagerGridComponent } from './grid/manager-grid.component';

const routes: Routes = [
  {
    path: '',
    component: ManagerGridComponent,
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
  providers: [ ContractorsAndPortfoliosService ],
})
export class ManagersModule {}
