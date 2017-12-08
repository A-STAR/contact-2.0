import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorPropertyComponent } from './property.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorPropertyComponent
  ],
  declarations: [
    DebtorPropertyComponent
  ],
})
export class DebtorPropertyModule {}
