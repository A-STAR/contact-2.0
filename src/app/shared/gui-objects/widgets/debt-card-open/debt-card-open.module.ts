import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OpenDebtCardService } from './debt-card-open.service';

import { DialogActionModule } from '../../../components/dialog-action/dialog-action.module';
import { DebtCardOpenComponent } from './debt-card-open.component';


@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
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
