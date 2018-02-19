import { NgModule } from '@angular/core';

import { WorkplacesSharedModule } from '../../shared/shared.module';

import { DebtorDocumentComponent } from './document.component';

@NgModule({
  imports: [
    WorkplacesSharedModule,
  ],
  exports: [
    DebtorDocumentComponent
  ],
  declarations: [
    DebtorDocumentComponent
  ],
})
export class DebtorDocumentModule { }
