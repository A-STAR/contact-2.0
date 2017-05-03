import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DialogModule, ButtonModule } from 'primeng/primeng';

import { SharedModule } from '../../../shared/shared.module';
import { RolesComponent } from './roles.component';

const routes: Routes = [
  { path: '', component: RolesComponent },
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
    RolesComponent,
  ]
})
export class RolesModule { }
