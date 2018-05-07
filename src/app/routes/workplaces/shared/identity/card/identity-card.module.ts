import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '@app/shared/shared.module';

import { IdentityCardComponent } from './identity-card.component';

const routes: Routes = [
  {
    path: '',
    component: IdentityCardComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    IdentityCardComponent,
  ],
})
export class IdentityCardModule {}
