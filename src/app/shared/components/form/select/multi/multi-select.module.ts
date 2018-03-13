import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AlignmentModule } from '@app/shared/directives/alignment/alignment.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DropdownModule } from '../../../dropdown/dropdown.module';

import { MultiSelectComponent } from './multi-select.component';

@NgModule({
  imports: [
    AlignmentModule,
    CheckModule,
    CommonModule,
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
