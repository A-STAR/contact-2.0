import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { InfoDialogModule } from '../../../../components/dialog/info/info-dialog.module';

import { PromiseCardComponent } from './promise-card.component';

@NgModule({
  imports: [
    CommonModule,
    DialogActionModule,
    DynamicFormModule,
    InfoDialogModule,
    TranslateModule,
  ],
  exports: [
    PromiseCardComponent,
  ],
  declarations: [
    PromiseCardComponent,
  ],
  entryComponents: [
    PromiseCardComponent,
  ]
})
export class PromiseCardModule { }
