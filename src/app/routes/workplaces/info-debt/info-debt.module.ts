import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GridModule } from './grid/grid.module';
import { SharedModule } from '../../../shared/shared.module';

import { InfoDebtService } from './info-debt.service';

import { InfoDebtComponent } from './info-debt.component';

const routes: Routes = [
  {
    path: '',
    component: InfoDebtComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    GridModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [
    InfoDebtComponent,
  ],
  providers: [
    InfoDebtService,
  ]
})
export class InfoDebtModule {}
