import { NgModule } from '@angular/core';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { ContractorsAndPortfoliosVersionComponent } from './contractors-and-portfolios-version.component';

@NgModule({
  imports: [
    RoutesSharedModule,
    SharedModule
  ],
  declarations: [ ContractorsAndPortfoliosVersionComponent ],
  exports: [ ContractorsAndPortfoliosVersionComponent ]
})
export class ContractorsAndPortfoliosVersionModule { }
