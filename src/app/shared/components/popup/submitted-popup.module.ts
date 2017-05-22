import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { SubmittedPopupComponent } from './submitted-popup.component';
import { DialogModule } from '../dialog/dialog.module';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    SubmittedPopupComponent,
  ],
  declarations: [
    SubmittedPopupComponent,
  ],
  providers: [
  ],
})
export class SubmittedPopupModule {
}
