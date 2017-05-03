import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogModule, ButtonModule } from 'primeng/primeng';

import { SharedModule } from '../../../shared/shared.module';
import { ConstantsComponent } from './constants.component';

const routes: Routes = [
  { path: '', component: ConstantsComponent },
];

@NgModule({
  imports: [
    ButtonModule,
    DialogModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    ConstantsComponent,
  ]
})
export class ConstantsModule { }