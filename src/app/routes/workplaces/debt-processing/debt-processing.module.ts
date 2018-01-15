import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { DebtProcessingService } from './debt-processing.service';

import { DebtProcessingComponent } from './debt-processing.component';

const gridKeys = [ 'all', 'callBack', 'currentJob', 'visits', 'promisePay', 'partPay', 'problem', 'returned' ];

const routes: Routes = [
  {
    path: '',
    component: DebtProcessingComponent,
    data: {
      reuse: true,
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all',
      },
      // Can't pass grid key as route param because component will always be reused.
      // Instead, we have to use separate route for every grid key.
      ...gridKeys.map(path => ({ path, loadChildren: './grid/grid.module#GridModule' })),
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtProcessingComponent,
  ],
  providers: [
    DebtProcessingService,
  ]
})
export class DebtProcessingModule {}
