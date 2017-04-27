import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/primeng';

import { SharedModule } from '../../../shared/shared.module';
import { ConstantsComponent } from './constants.component';

const routes: Routes = [
  { path: '', component: ConstantsComponent },
];

@NgModule({
  imports: [
    DialogModule,
    FormsModule,
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
