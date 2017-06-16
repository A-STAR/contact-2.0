import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from '../dialog/dialog.module';

import { DialogActionComponent } from './dialog-action.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    DialogActionComponent,
  ],
  declarations: [
    DialogActionComponent,
  ],
})
export class DialogActionModule {
}
