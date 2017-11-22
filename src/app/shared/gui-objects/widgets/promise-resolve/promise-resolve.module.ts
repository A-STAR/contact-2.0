import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PromiseConfirmDialogModule } from './dialog/confirm/promise-confirm-dialog.module';
import { PromiseRemoveDialogModule } from './dialog/remove/promise-remove-dialog.module';

import { PromiseResolveService } from './promise-resolve.service';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    PromiseConfirmDialogModule,
    PromiseRemoveDialogModule,
  ],
  providers: [
    PromiseResolveService,
  ]
})
export class PromiseResolveModule { }
