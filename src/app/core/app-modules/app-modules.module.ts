import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EffectsModule } from '@ngrx/effects';

import { DebtorCardEffects } from './debtor-card/debtor-card.effects';
import { DebtorCardService } from './debtor-card/debtor-card.service';

@NgModule({
  imports: [
    CommonModule,
    EffectsModule.forFeature([
      DebtorCardEffects,
    ]),
  ],
  providers: [
    DebtorCardService,
  ]
})
export class AppModulesModule { }
