import { NgModule } from '@angular/core';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { SharedModule } from '@app/shared/shared.module';

import { SelectPersonService } from './select-person.service';

import { SelectPersonComponent } from './select-person.component';

@NgModule({
  imports: [
    DynamicLoaderModule.withComponent(SelectPersonComponent),
    SharedModule,
  ],
  declarations: [
    SelectPersonComponent,
  ],
  providers: [
    SelectPersonService,
  ],
})
export class SelectPersonModule {}
