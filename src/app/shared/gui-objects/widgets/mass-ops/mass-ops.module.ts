import { NgModule } from '@angular/core';

import { AttributesModule } from './attributes/attributes.module';

@NgModule({
  imports: [
    AttributesModule,
  ],
  exports: [
    AttributesModule,
  ],
})
export class MassOpsModule {}
