import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { TitlebarModule } from '@app/shared/components/titlebar/titlebar.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { CurrenciesGridComponent } from './currencies-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    GridModule,
    TitlebarModule,
    Toolbar2Module,
  ],
  exports: [
    CurrenciesGridComponent,
  ],
  declarations: [
    CurrenciesGridComponent,
  ],
  entryComponents: [
    CurrenciesGridComponent,
  ]
})
export class CurrenciesGridModule { }
