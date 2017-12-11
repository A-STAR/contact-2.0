import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorEmailComponent } from './email.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorEmailComponent
  ],
  declarations: [
    DebtorEmailComponent
  ],
  providers: [],
})
export class DebtorEmailModule { }
