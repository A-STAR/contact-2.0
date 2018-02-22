import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { ContractorsAndPortfoliosVersionComponent } from './contractors-and-portfolios-version.component';

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [ ContractorsAndPortfoliosVersionComponent ],
  exports: [ ContractorsAndPortfoliosVersionComponent ]
})
export class ContractorsAndPortfoliosVersionModule { }
