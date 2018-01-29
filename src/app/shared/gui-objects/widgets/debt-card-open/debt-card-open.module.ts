import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { InfoDialogModule } from '../../../components/dialog/info/info-dialog.module';

import { OpenDebtCardService } from './debt-card-open.service';

import { DebtCardOpenByDebtorComponent } from './debt-card-open-by-debtor.component';
import { DebtCardOpenByDebtComponent } from './debt-card-open-by-debt.component';


@NgModule({
  imports: [
    CommonModule,
    InfoDialogModule,
    TranslateModule,
  ],
  exports: [
    DebtCardOpenByDebtComponent,
    DebtCardOpenByDebtorComponent,
  ],
  declarations: [
    DebtCardOpenByDebtComponent,
    DebtCardOpenByDebtorComponent,
  ],
  providers: [
    OpenDebtCardService,
  ]
})
export class OpenDebtCardModule { }
