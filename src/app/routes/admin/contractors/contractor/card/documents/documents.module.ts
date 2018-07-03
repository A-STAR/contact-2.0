import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { ContractorDocumentsComponent } from './documents.component';

const routes: Routes = [
  {
    path: '',
    component: ContractorDocumentsComponent,
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
    ContractorDocumentsComponent,
  ],
})
export class ContractorDocumentsModule {}
