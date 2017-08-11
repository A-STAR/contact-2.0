import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorIdentityComponent } from './identity.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorIdentityComponent
  ],
  declarations: [
    DebtorIdentityComponent
  ],
  providers: [],
})
export class DebtorIdentityModule { }
