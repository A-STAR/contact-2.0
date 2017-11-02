import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../components/dialog/dialog.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { InfoDialogModule } from '../../../../components/dialog/info/info-dialog.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { PledgerGridComponent } from './pledger-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    GridModule,
    InfoDialogModule,
    Toolbar2Module,
    TranslateModule,
  ],
  exports: [
    PledgerGridComponent,
  ],
  declarations: [
    PledgerGridComponent,
  ],
  entryComponents: [
    PledgerGridComponent,
  ]
})
export class PledgerGridModule { }
