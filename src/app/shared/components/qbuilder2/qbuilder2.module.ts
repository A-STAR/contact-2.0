import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { DatePickerModule } from '../form/datepicker/datepicker.module';

import { QBuilder2Component } from './qbuilder2.component';
import { QBuilder2ConditionComponent } from './condition/qbuilder2-condition.component';
import { QBuilder2GroupComponent } from './group/qbuilder2-group.component';

@NgModule({
  imports: [
    CommonModule,
    DatePickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    QBuilder2Component,
    QBuilder2ConditionComponent,
    QBuilder2GroupComponent,
  ],
  declarations: [
    QBuilder2Component,
    QBuilder2ConditionComponent,
    QBuilder2GroupComponent,
  ],
  providers: [],
})
export class QBuilder2Module { }
