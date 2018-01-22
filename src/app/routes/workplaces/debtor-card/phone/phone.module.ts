import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { DebtorPhoneComponent } from './phone.component';

@NgModule({
  imports: [
    SharedModule,
    WorkplacesSharedModule,
  ],
  exports: [
    DebtorPhoneComponent
  ],
  declarations: [
    DebtorPhoneComponent
  ],
  providers: [],
})
export class DebtorPhoneModule { }
