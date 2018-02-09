import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { AttributesService } from './attributes.service';

import { ContactRegistrationAttributesComponent } from './attributes.component';

@NgModule({
  imports: [
    SharedModule,
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
