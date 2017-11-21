import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromiseConfirmDialogModule } from './dialog/confirm/promise-confirm-dialog.module';

import { PromiseResolveService } from './promise-resolve.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    PromiseConfirmDialogModule,
  ],
  providers: [
    PromiseResolveService,
  ]
})
export class PromiseResolveModule { }
