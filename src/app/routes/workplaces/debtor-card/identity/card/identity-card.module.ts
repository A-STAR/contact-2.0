import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '@app/shared/shared.module';

import { IdentityCardComponent } from './identity-card.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  exports: [
    IdentityCardComponent,
  ],
  declarations: [
    IdentityCardComponent,
  ],
})
export class IdentityCardModule { }
