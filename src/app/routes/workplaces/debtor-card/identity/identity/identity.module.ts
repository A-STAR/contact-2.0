import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IdentityCardModule } from './card/identity-card.module';
import { IdentityGridModule } from './grid/identity-grid.module';

import { IdentityService } from './identity.service';

@NgModule({
  imports: [
    IdentityCardModule,
    IdentityGridModule,
    CommonModule,
  ],
  exports: [
    IdentityCardModule,
    IdentityGridModule,
  ],
  providers: [
    IdentityService,
  ]
})
export class IdentityModule { }
