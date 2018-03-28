import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorPhoneComponent } from './phone.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorPhoneComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtorPhoneComponent,
  ],
  providers: [],
})
export class DebtorPhoneModule {}
