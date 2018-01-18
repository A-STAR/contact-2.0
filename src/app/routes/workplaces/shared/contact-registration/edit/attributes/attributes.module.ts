import { NgModule } from '@angular/core';
import { TreeTableModule } from 'primeng/primeng';

import { SharedModule } from '@app/shared/shared.module';

import { AttributesService } from './attributes.service';

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
  providers: [
    AttributesService,
  ]
})
export class AttributesModule {}
