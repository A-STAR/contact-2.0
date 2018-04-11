import { NgModule } from '@angular/core';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { SharedModule } from '@app/shared/shared.module';

import { SelectPersonComponent } from './select-person.component';

@NgModule({
  imports: [
    DynamicLoaderModule.withComponent(SelectPersonComponent),
    SharedModule,
  ],
  declarations: [
    SelectPersonComponent,
  ],
})
export class SelectPersonModule {}
