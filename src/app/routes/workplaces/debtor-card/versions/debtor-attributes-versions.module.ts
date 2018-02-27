import { NgModule } from '@angular/core';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorAttributesVersionsComponent } from './debtor-attributes-versions.component';

@NgModule({
  imports: [
    RoutesSharedModule,
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
