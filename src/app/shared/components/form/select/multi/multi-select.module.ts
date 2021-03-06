import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DropdownModule } from '../../../dropdown/dropdown.module';

import { MultiSelectComponent } from './multi-select.component';

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
    MultiSelectComponent,
  ],
  declarations: [
    MultiSelectComponent
  ],
})
export class MultiSelectModule { }
