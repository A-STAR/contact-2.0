import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';

import { ConfirmComponent } from './confirm.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule
  ],
  declarations: [ ConfirmComponent ],
  exports: [ ConfirmComponent ]
})
export class ConfirmModule { }
