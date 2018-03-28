import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorContactLogTabComponent } from './contact-log-tab.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorContactLogTabComponent,
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
    DebtorContactLogTabComponent,
  ],
})
export class ContactLogTabModule {}
