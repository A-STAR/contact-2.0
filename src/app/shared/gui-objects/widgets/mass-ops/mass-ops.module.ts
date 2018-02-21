import { NgModule } from '@angular/core';

import { AttributesModule } from './attributes/attributes.module';
import { OutsourcingModule } from './outsourcing/outsourcing.module';

@NgModule({
  imports: [
    AttributesModule,
  ],
  exports: [
    AttributesModule,
    OutsourcingModule,
  ],
})
export class MassOpsModule {}
