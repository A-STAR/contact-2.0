import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicForm2Module } from '@app/shared/components/form/dynamic-form-2/dynamic-form-2.module';

import { AddressCardComponent } from './address-card.component';

@NgModule({
  imports: [
    CommonModule,
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
