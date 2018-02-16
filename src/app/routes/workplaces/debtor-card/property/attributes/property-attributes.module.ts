import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorPropertyAttributesComponent } from './property-attributes.component';

@NgModule({
  imports: [
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
