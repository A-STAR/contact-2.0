import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorPromiseComponent } from './promise.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorPromiseComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    DebtorPromiseComponent
  ],
})
export class PromiseModule {}
