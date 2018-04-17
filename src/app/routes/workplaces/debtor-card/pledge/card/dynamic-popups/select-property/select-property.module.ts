import { NgModule } from '@angular/core';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { SharedModule } from '@app/shared/shared.module';

import { SelectPropertyService } from './select-property.service';

import { SelectPropertyComponent } from './select-property.component';

@NgModule({
  imports: [
    DynamicLoaderModule.withComponent(SelectPropertyComponent),
    SharedModule,
  ],
  declarations: [
    SelectPropertyComponent,
  ],
  providers: [
    SelectPropertyService,
  ],
})
export class SelectPropertyModule {}
