import { NgModule } from '@angular/core';
import { TreeTableModule } from 'primeng/primeng';

import { SharedModule } from '../../../../shared/shared.module';

import { AttributesComponent } from './attributes.component';

@NgModule({
  imports: [
    SharedModule,
    TreeTableModule,
  ],
  exports: [
    AttributesComponent,
  ],
  declarations: [
    AttributesComponent,
  ],
})
export class AttributesModule {}
