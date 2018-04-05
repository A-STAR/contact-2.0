import { NgModule } from '@angular/core';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { SharedModule } from '@app/shared/shared.module';

import { LicenceComponent } from './licence.component';

@NgModule({
  imports: [
    DynamicLoaderModule.withComponent(LicenceComponent),
    SharedModule,
  ],
  declarations: [
    LicenceComponent,
  ],
})
export class LicenceModule {}
