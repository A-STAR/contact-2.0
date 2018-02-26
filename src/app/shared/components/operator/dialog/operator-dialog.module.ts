import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridModule } from '@app/shared/components/grid/grid.module';

import { OperatorDialogComponent } from './operator-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DialogModule,
    GridModule,
  ],
  exports: [
    OperatorDialogComponent,
  ],
  declarations: [
    OperatorDialogComponent,
  ]
})
export class OperatorDialogModule { }
