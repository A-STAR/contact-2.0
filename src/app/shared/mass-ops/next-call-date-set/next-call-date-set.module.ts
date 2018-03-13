import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';
import { NextCallDateSetDialogComponent } from './next-call-date-set.component';

import { NextCallDateSetService } from './next-call-date-set.service';

@NgModule({
  imports: [
    DialogModule,
    DynamicFormModule,
    CommonModule,
    TranslateModule
  ],
  exports: [
    NextCallDateSetDialogComponent,
  ],
  declarations: [
    NextCallDateSetDialogComponent
  ],
  providers: [
    NextCallDateSetService,
  ]
})
export class NextCallDateSetModule { }
