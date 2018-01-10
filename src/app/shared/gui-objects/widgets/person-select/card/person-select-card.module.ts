import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { PersonSelectCardComponent } from './person-select-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    PersonSelectCardComponent,
  ],
  declarations: [
    PersonSelectCardComponent,
  ],
  entryComponents: [
    PersonSelectCardComponent,
  ]
})
export class PersonSelectCardModule { }
