import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { PortfolioEditComponent } from './portfolio-edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    PortfolioEditComponent
  ],
  declarations: [
    PortfolioEditComponent,
  ]
})
export class PortfolioEditModule {
}
