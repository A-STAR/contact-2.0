import { NgModule } from '@angular/core';

import { DynamicComponentLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { SharedModule } from '@app/shared/shared.module';

import { LicenceComponent } from './licence.component';

@NgModule({
  imports: [
    DynamicComponentLoaderModule.withComponent(LicenceComponent),
    SharedModule,
  ],
  declarations: [
    LicenceComponent,
  ],
})
export class LicenceModule {}
