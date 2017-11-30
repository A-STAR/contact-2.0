import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisitAddDialogModule } from './dialog/visit-add-dialog.module';

import { VisitAddService } from './visit-add.service';

@NgModule({
  imports: [
    CommonModule,
    VisitAddDialogModule,
  ],
  exports: [
    VisitAddDialogModule,
  ],
  providers: [
    VisitAddService,
  ]
})
export class VisitAddModule { }
