import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';
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
