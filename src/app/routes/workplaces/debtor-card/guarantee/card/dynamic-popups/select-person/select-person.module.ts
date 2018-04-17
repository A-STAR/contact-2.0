import { NgModule } from '@angular/core';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { SharedModule } from '@app/shared/shared.module';

import { SelectPersonComponent } from './select-person.component';
import { SelectPersonFilterComponent } from './filter/select-person-filter.component';
import { SelectPersonGridComponent } from './grid/select-person-grid.component';

@NgModule({
  imports: [
    DynamicLoaderModule.withComponent(SelectPersonComponent),
    SharedModule,
  ],
  declarations: [
    SelectPersonComponent,
    SelectPersonFilterComponent,
    SelectPersonGridComponent,
  ],
})
export class SelectPersonModule {}
