import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContactRegistrationDebtReasonComponent } from './debt-reason.component';

@NgModule({
  declarations: [
    ContactRegistrationDebtReasonComponent,
  ],
  exports: [
    ContactRegistrationDebtReasonComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class ContactRegistrationDebtReasonModule {}
