import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { GuarantorGridComponent } from './guarantor-grid.component';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    Toolbar2Module,
  ],
  exports: [
    GuarantorGridComponent,
  ],
  declarations: [
    GuarantorGridComponent,
  ],
  entryComponents: [
    GuarantorGridComponent,
  ]
})
export class GuarantorGridModule { }
