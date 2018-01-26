import { NgModule } from '@angular/core';

import { SelectModule } from '@app/shared/components/form/select/select.module';
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
    SelectModule,
    SharedModule,
  ]
})
export class ContactRegistrationDebtReasonModule {}
