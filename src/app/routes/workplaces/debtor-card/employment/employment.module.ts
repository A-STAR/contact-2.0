import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorEmploymentComponent } from './employment.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorEmploymentComponent
  ],
  declarations: [
    DebtorEmploymentComponent
  ],
})
export class DebtorEmploymentModule {}
