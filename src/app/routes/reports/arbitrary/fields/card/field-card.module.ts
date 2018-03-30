import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { FieldsService } from '../fields.service';

import { FieldCardComponent } from './field-card.component';

const routes: Routes = [
  {
    path: '',
    component: FieldCardComponent,
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
  ],
  declarations: [
    FieldCardComponent,
  ],
  exports: [
    FieldCardComponent,
  ],
  providers: [
    FieldsService
  ]
})
export class FieldCardModule { }
