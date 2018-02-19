import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { PledgorModule } from '../pledgor/pledgor.module';

import { DebtorPledgeCardComponent } from './pledge-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    PledgorModule
  ],
  exports: [
    DebtorPledgeCardComponent,
  ],
  declarations: [
    DebtorPledgeCardComponent,
  ],
})
export class PledgeCardModule { }
