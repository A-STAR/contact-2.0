import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { RoutesSharedModule } from '@app/routes/shared/shared.module';
import { SharedModule } from '@app/shared/shared.module';

import { PortfolioAttributesComponent } from './portfolio-attributes.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioAttributesComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RoutesSharedModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  declarations: [PortfolioAttributesComponent],
  exports: [PortfolioAttributesComponent]
})
export class PortfolioAttributesModule { }
