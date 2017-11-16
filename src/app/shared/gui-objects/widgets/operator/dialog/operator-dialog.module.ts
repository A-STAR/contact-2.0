import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';
import { OperatorGridModule } from '../grid/operator-grid.module';

import { OperatorDialogComponent } from './operator-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DialogActionModule,
    GridModule,
    TranslateModule,
    OperatorGridModule,
  ],
  exports: [
    OperatorDialogComponent,
  ],
  declarations: [
    OperatorDialogComponent,
  ],
  entryComponents: [
    OperatorDialogComponent,
  ]
})
export class OperatorDialogModule { }
