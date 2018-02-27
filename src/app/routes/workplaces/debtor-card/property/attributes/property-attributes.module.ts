import { NgModule } from '@angular/core';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorPropertyAttributesComponent } from './property-attributes.component';

@NgModule({
  imports: [
    RoutesSharedModule,
    SharedModule,
  ],
  exports: [
    DebtorPropertyAttributesComponent
  ],
  declarations: [
    DebtorPropertyAttributesComponent
  ],
  entryComponents: [
    DebtorPropertyAttributesComponent,
  ]
})
export class DebtorPropertyAttributesModule {}
