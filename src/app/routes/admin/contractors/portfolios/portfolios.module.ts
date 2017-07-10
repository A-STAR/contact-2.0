import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';

import { PortfoliosComponent } from './portfolios.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PortfoliosComponent,
  ],
  declarations: [
    PortfoliosComponent,
  ]
})
export class PortfoliosModule {
}
