import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { PromiseCardComponent } from './promise-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
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
