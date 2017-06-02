import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from "../dialog.module";

import { ActionDialogComponent } from './action-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    ActionDialogComponent,
  ],
  declarations: [
    ActionDialogComponent,
  ],
})
export class ActionDialogModule {
}
