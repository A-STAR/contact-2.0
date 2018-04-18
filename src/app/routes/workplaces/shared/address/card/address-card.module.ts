import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DynamicForm2Module } from '@app/shared/components/form/dynamic-form-2/dynamic-form-2.module';

import { AddressCardComponent } from './address-card.component';

const routes: Routes = [
  {
    path: '',
    component: AddressCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    DynamicForm2Module,
    RouterModule.forChild(routes),
    TranslateModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    AddressCardComponent,
  ],
})
export class AddressCardModule {}
