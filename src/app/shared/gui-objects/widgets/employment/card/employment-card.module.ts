import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { EmploymentCardComponent } from './employment-card.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    EmploymentCardComponent,
  ],
  declarations: [
    EmploymentCardComponent,
  ],
  entryComponents: [
    EmploymentCardComponent,
  ]
})
export class EmploymentCardModule { }
