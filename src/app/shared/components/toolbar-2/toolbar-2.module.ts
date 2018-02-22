import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DropdownModule } from '../dropdown/dropdown.module';

import { ButtonComponent } from './button/button.component';
import { Toolbar2Component } from './toolbar-2.component';

@NgModule({
  imports: [
    CheckModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    Toolbar2Component,
  ],
  declarations: [
    ButtonComponent,
    Toolbar2Component,
  ]
})
export class Toolbar2Module {}
