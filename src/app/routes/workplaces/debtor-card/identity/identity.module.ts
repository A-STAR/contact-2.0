import { NgModule } from '@angular/core';

import { IdentityCardModule } from '@app/routes/workplaces/debtor-card/identity/card/identity-card.module';
import { IdentityGridModule } from '@app/routes/workplaces/debtor-card/identity/grid/identity-grid.module';
import { SharedModule } from '@app/shared/shared.module';

import { IdentityService } from '@app/routes/workplaces/debtor-card/identity/identity.service';

import { DebtorIdentityComponent } from './identity.component';

@NgModule({
  imports: [
    SharedModule,
    IdentityCardModule,
  ],
  exports: [
    IdentityGridModule,
    DebtorIdentityComponent,
  ],
  providers: [ IdentityService ],
  declarations: [
    DebtorIdentityComponent
  ]
})
export class DebtorIdentityModule { }
