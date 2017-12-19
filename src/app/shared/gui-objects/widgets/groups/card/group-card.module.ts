import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { GroupCardComponent } from './group-card.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    DynamicFormModule
  ],
  exports: [
    GroupCardComponent,
  ],
  declarations: [
    GroupCardComponent,
  ],
  entryComponents: [
    GroupCardComponent,
  ]
})
export class GroupCardModule { }
