import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { OpenDebtCardService } from './debt-card-open.service';

import { InfoDialogModule } from '../../../components/dialog/info/info-dialog.module';
import { DebtCardOpenComponent } from './debt-card-open.component';


@NgModule({
  imports: [
    CommonModule,
    InfoDialogModule,
    TranslateModule,
  ],
  exports: [
    DebtCardOpenComponent,
  ],
  declarations: [
    DebtCardOpenComponent,
  ],
  providers: [
    OpenDebtCardService,
  ]
})
export class OpenDebtCardModule { }
