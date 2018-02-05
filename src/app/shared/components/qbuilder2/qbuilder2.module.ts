import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DateTimeModule } from '../form/datetime/datetime.module';
import { SelectModule } from '../form/select/select.module';

import { QBuilder2Component } from './qbuilder2.component';
import { QBuilder2ConditionComponent } from './condition/qbuilder2-condition.component';
import { QBuilder2GroupComponent } from './group/qbuilder2-group.component';
import { QBuilder2ValueComponent } from './value/qbuilder2-value.component';

@NgModule({
  imports: [
    CommonModule,
    DateTimeModule,
    FormsModule,
    ReactiveFormsModule,
    SelectModule,
    TranslateModule,
  ],
  exports: [
    QBuilder2Component,
    QBuilder2ConditionComponent,
    QBuilder2GroupComponent,
    QBuilder2ValueComponent,
  ],
  declarations: [
    QBuilder2Component,
    QBuilder2ConditionComponent,
    QBuilder2GroupComponent,
    QBuilder2ValueComponent,
  ],
  providers: [],
})
export class QBuilder2Module { }
