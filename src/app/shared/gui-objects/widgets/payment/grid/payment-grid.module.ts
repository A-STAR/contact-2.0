import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { PaymentGridComponent } from './payment-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    PaymentGridComponent,
  ],
  declarations: [
    PaymentGridComponent,
  ],
  entryComponents: [
    PaymentGridComponent,
  ]
})
export class PaymentGridModule { }
