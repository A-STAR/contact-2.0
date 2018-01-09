import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { DebtorAttributesComponent } from './attributes.component';
import { DebtorAttributesVersionsComponent } from './versions/debtor-attributes-versions.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DebtorAttributesComponent
  ],
  declarations: [
    DebtorAttributesComponent,
    DebtorAttributesVersionsComponent
  ],
  entryComponents: [
    DebtorAttributesComponent,
  ]
})
export class DebtorAttributesModule {}
