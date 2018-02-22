import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../../../shared/shared.module';

import { PortfolioAttributesComponent } from './portfolio-attributes.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [PortfolioAttributesComponent],
  exports: [PortfolioAttributesComponent]
})
export class PortfolioAttributesModule { }
