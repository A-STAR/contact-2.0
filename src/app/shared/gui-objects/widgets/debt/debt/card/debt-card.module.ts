import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DebtComponentModule } from '../../component/debt-component.module';
import { DynamicFormModule } from '../../../../../components/form/dynamic-form/dynamic-form.module';

import { DebtCardComponent } from './debt-card.component';

@NgModule({
  imports: [
    CommonModule,
    DebtComponentModule,
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
