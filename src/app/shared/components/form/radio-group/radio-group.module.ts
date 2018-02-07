import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CheckModule } from '../check/check.module';

import { RadioGroupComponent } from './radio-group.component';

@NgModule({
  imports: [
    CheckModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [
    RadioGroupComponent,
  ],
  declarations: [
    RadioGroupComponent,
  ],
})
export class RadioGroupModule { }
