import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorPromiseComponent } from './promise.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorPromiseComponent
  ],
  declarations: [
    DebtorPromiseComponent
  ],
})
export class DebtorPromiseModule {}
