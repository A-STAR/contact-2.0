import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../dialog.module';
import { DynamicFormModule } from '../../../components/form/dynamic-form/dynamic-form.module';

import { BlockDialogComponent } from './block-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    BlockDialogComponent,
  ],
  declarations: [
    BlockDialogComponent,
  ],
})
export class BlockDialogModule {
}
