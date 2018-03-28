import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { IdentityCardModule } from '@app/routes/workplaces/debtor-card/identity/card/identity-card.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorIdentityComponent } from './identity.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorIdentityComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    IdentityCardModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtorIdentityComponent,
  ]
})
export class IdentityModule {}
