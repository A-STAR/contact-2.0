import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PortfolioDocumentsComponent } from './documents.component';

const routes: Routes = [
  {
    path: '',
    component: PortfolioDocumentsComponent,
    data: {
      reuse: true,
    },
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    WorkplacesSharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    PortfolioDocumentsComponent,
  ],
})
export class PortfolioDocumentsModule {}
