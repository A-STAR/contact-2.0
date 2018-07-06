import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';
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
    RouterModule.forChild(routes),
    SharedModule,
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
