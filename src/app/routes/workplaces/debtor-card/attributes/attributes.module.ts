import { NgModule } from '@angular/core';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { DebtorAttributesComponent } from './attributes.component';

@NgModule({
  imports: [
    RoutesSharedModule,
    SharedModule,
  ],
  exports: [
    DebtorAttributesComponent
  ],
  declarations: [
    DebtorAttributesComponent
  ],
  entryComponents: [
    DebtorAttributesComponent,
  ]
})
export class DebtorAttributesModule {}
