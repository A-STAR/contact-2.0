import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

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
