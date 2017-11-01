import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { PledgerCardComponent } from './pledger-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    PledgerCardComponent,
  ],
  declarations: [
    PledgerCardComponent,
  ],
  entryComponents: [
    PledgerCardComponent,
  ]
})
export class PledgerCardModule { }
