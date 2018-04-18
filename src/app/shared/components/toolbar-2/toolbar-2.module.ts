import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DropdownModule } from '../dropdown/dropdown.module';

import { Toolbar2Component } from './toolbar-2.component';
import { Toolbar2ItemComponent } from './item/toolbar2-item.component';

@NgModule({
  imports: [
    CheckModule,
    CommonModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    TranslateModule,
  ],
  exports: [
    Toolbar2Component,
  ],
  declarations: [
    Toolbar2Component,
    Toolbar2ItemComponent,
  ]
})
export class Toolbar2Module {}
