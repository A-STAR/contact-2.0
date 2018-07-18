import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';

import { DebtProcessingService } from './debt-processing.service';
import { CanActivateTabGuard } from '@app/shared/components/layout/tabview/header/header.service';

import { DebtProcessingComponent } from './debt-processing.component';

const routes: Routes = [
  {
    path: '',
    component: DebtProcessingComponent,
    canActivate: [ CanActivateTabGuard ],
    canActivateChild: [ CanActivateTabGuard ],
    data: {
      reuse: true,
      tabs: [
        {
          link: 'all',
          permission: 'DEBT_PROCESSING_TAB_ALL'
        },
        {
          link: 'callBack',
          permission: 'DEBT_PROCESSING_TAB_CALL_BACK'
        },
        {
          link: 'currentJob',
          permission: 'DEBT_PROCESSING_TAB_CURRENT_JOB'
        },
        {
          link: 'visits',
          permission: 'DEBT_PROCESSING_TAB_VISITS'
        },
        {
          link: 'promisePay',
          permission: 'DEBT_PROCESSING_TAB_PROMISE_PAY'
        },
        {
          link: 'partPay',
          permission: 'DEBT_PROCESSING_TAB_PART_PAY'
        },
        {
          link: 'problem',
          permission: 'DEBT_PROCESSING_TAB_PROBLEM'
        },
        {
          link: 'returned',
          permission: 'DEBT_PROCESSING_TAB_RETURN'
        }
      ]
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
      // TODO(d.maltsev): see whether it's possible to modify resuse strategy
      // to use with route params
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
