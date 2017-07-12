import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { ActionsLogFilterComponent } from './actions-log-filter.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ActionsLogFilterComponent,
  ],
  exports: [
    ActionsLogFilterComponent,
  ]
})
export class ActionsLogFilterModule {
}
