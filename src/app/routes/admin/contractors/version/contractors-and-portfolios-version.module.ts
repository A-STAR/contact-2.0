import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';

import { ContractorsAndPortfoliosVersionComponent } from './contractors-and-portfolios-version.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule
  ],
  declarations: [ ContractorsAndPortfoliosVersionComponent ],
  exports: [ ContractorsAndPortfoliosVersionComponent ]
})
export class ContractorsAndPortfoliosVersionModule { }
