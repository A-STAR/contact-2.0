import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { RadioGroupModule } from '../radio-group/radio-group.module';
import { SelectModule } from '../select/select.module';

import { DynamicForm2ControlComponent } from './control/dynamic-form-2-control.component';
import { DynamicForm2GroupComponent } from './group/dynamic-form-2-group.component';

import { DynamicForm2Component } from './dynamic-form-2.component';

@NgModule({
  imports: [
    CommonModule,
    RadioGroupModule,
    ReactiveFormsModule,
    SelectModule,
    TranslateModule,
  ],
  exports: [
    DynamicForm2Component,
  ],
  declarations: [
    DynamicForm2Component,
    DynamicForm2ControlComponent,
    DynamicForm2GroupComponent,
  ]
})
export class DynamicForm2Module { }
