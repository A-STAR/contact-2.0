import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { DebtorEmailCardComponent } from './email-card.component';

import { EmailService } from '../email.service';

const routes: Routes = [
  {
    path: '',
    component: DebtorEmailCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    DebtorEmailCardComponent,
  ],
  declarations: [
    DebtorEmailCardComponent,
  ],
  providers: [
    EmailService
  ]
})
export class EmailCardModule { }
