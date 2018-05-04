import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { DocumentCardComponent } from './document-card.component';

import { DocumentService } from '../document.service';

const routes: Routes = [
  {
    path: '',
    component: DocumentCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    DocumentCardComponent,
  ],
  declarations: [
    DocumentCardComponent,
  ],
  providers: [
    DocumentService
  ]
})
export class DocumentCardModule {}
