import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { AttributesService } from './attributes.service';

import { AttributesComponent } from './attributes.component';

@NgModule({
  imports: [
    SharedModule,
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
export class AttributesModule {
}
