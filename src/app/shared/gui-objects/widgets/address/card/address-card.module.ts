import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

// import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { DynamicForm2Module } from '../../../../components/form/dynamic-form-2/dynamic-form-2.module';

import { AddressCardComponent } from './address-card.component';

@NgModule({
  imports: [
    CommonModule,
    // DynamicFormModule,
    DynamicForm2Module,
    TranslateModule,
  ],
  exports: [
    AddressCardComponent,
  ],
  declarations: [
    AddressCardComponent,
  ],
  entryComponents: [
    AddressCardComponent,
  ]
})
export class AddressCardModule { }
