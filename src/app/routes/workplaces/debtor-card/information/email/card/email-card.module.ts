import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { DebtorEmailCardComponent } from './email-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    DebtorEmailCardComponent,
  ],
  declarations: [
    DebtorEmailCardComponent,
  ],
})
export class EmailCardModule { }
