import { NgModule } from '@angular/core';
import { TreeTableModule } from 'primeng/primeng';

import { SharedModule } from '@app/shared/shared.module';

import { AttributesService } from './attributes.service';

import { ContactRegistrationAttributesComponent } from './attributes.component';

@NgModule({
  imports: [
    SharedModule,
    TreeTableModule,
  ],
  exports: [
    ContactRegistrationAttributesComponent,
  ],
  declarations: [
    ContactRegistrationAttributesComponent,
  ],
  providers: [
    AttributesService,
  ]
})
export class AttributesModule {}
