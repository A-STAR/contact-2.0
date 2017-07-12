import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../dialog.module';

import { InfoDialogComponent } from './info-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    TranslateModule,
  ],
  exports: [
    InfoDialogComponent,
  ],
  declarations: [
    InfoDialogComponent,
  ],
})
export class InfoDialogModule {
}
