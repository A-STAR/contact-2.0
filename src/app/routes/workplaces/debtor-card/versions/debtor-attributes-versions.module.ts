import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorAttributesVersionsComponent } from './debtor-attributes-versions.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorAttributesVersionsComponent
  ],
  declarations: [
    DebtorAttributesVersionsComponent
  ],
  entryComponents: [
    DebtorAttributesVersionsComponent,
  ]
})
export class DebtorAttributesVersionsModule {}
