import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

import { SharedModule } from '../../../shared/shared.module';

import { ConstantsService } from '../constants/constants.service';

import { ConstantsComponent } from './constants.component';
import { ConstantEditComponent } from './constant-edit/constant-edit.component';

const routes: Routes = [
  { path: '', component: ConstantsComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    ConstantsComponent,
    ConstantEditComponent,
  ],
  providers: [
    ConstantsService,
    DatePipe,
  ]
})
export class ConstantsModule { }
