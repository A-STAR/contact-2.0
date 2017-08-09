import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DropdownInputModule } from '../../../../components/form/dropdown/dropdown-input.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';

import { DebtCardComponent } from './debt-card.component';

@NgModule({
  imports: [
    CommonModule,
    DropdownInputModule,
    DynamicFormModule,
    TranslateModule,
  ],
  exports: [
    DebtCardComponent,
  ],
  declarations: [
    DebtCardComponent,
  ],
  entryComponents: [
    DebtCardComponent,
  ]
})
export class DebtCardModule { }
