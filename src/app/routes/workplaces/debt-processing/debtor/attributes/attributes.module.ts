import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { DebtorAttributesComponent } from './attributes.component';

@NgModule({
  imports: [
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
