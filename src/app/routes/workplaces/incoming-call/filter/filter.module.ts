import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { FilterComponent } from './filter.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    FilterComponent,
  ],
  exports: [
    FilterComponent,
  ]
})
export class FilterModule {}
