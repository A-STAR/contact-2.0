import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkplacesSharedModule } from '../../shared/shared.module';

import { DebtorDocumentComponent } from './document.component';

const routes: Routes = [
  {
    path: '',
    component: DebtorDocumentComponent,
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    WorkplacesSharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DebtorDocumentComponent,
  ],
})
export class DocumentModule {}
