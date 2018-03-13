import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DynamicFormModule } from '@app/shared/components/form/dynamic-form/dynamic-form.module';

import { VisitAddService } from './visit-add.service';

import { VisitAddDialogComponent } from './visit-add.component';


@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DynamicFormModule,
    TranslateModule,
  ],
  declarations: [
    VisitAddDialogComponent
  ],
  exports: [
    VisitAddDialogComponent,
  ],
  providers: [
    VisitAddService,
  ]
})
export class VisitAddModule { }
