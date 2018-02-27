import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { PortfolioAttributesComponent } from './portfolio-attributes.component';

@NgModule({
  imports: [
    CommonModule,
    RoutesSharedModule,
    SharedModule,
  ],
  declarations: [PortfolioAttributesComponent],
  exports: [PortfolioAttributesComponent]
})
export class PortfolioAttributesModule { }
