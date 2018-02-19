import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { DebtorEmailCardComponent } from './email-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
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
