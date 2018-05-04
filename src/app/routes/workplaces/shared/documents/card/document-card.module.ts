import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { DocumentCardComponent } from './document-card.component';

const routes: Routes = [
  {
    path: '',
    component: DocumentCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    DocumentCardComponent,
  ],
})
export class DocumentCardModule {}
