import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { DebtProcessingService } from './debt-processing.service';

import { DebtProcessingComponent } from './debt-processing.component';

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
      // Also, [].map doesn't work here, so we have to list every route manually.
      { path: 'all',        loadChildren: './grid/grid.module#GridModule' },
      { path: 'callBack',   loadChildren: './grid/grid.module#GridModule' },
      { path: 'currentJob', loadChildren: './grid/grid.module#GridModule' },
      { path: 'visits',     loadChildren: './grid/grid.module#GridModule' },
      { path: 'promisePay', loadChildren: './grid/grid.module#GridModule' },
      { path: 'partPay',    loadChildren: './grid/grid.module#GridModule' },
      { path: 'problem',    loadChildren: './grid/grid.module#GridModule' },
      { path: 'returned',   loadChildren: './grid/grid.module#GridModule' },
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
