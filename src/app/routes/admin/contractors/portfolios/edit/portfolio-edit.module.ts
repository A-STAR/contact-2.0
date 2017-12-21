import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../../shared/shared.module';
import { PortfolioAttributesModule } from './attributes/portfolio-attributes.module';

import { PortfolioEditComponent } from './portfolio-edit.component';

@NgModule({
  imports: [
    SharedModule,
    PortfolioAttributesModule,
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
