import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { CurrencyEditComponent } from './edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    CurrencyEditComponent
  ],
  declarations: [
    CurrencyEditComponent
  ],
})
export class CurrencyEditModule {}
