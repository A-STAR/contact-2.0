import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorDocumentComponent } from './document.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorDocumentComponent
  ],
  declarations: [
    DebtorDocumentComponent
  ],
})
export class DebtorDocumentModule { }
