import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../components/dialog/dialog.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { GuarantorGridComponent } from './guarantor-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    GridModule,
    Toolbar2Module,
    TranslateModule,
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
