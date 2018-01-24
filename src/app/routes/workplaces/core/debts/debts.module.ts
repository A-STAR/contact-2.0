import { EffectsModule } from '@ngrx/effects';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import { DebtsEffects } from './debts.effects';
import { DebtsService } from './debts.service';

import { debtsReducer } from './debts.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature('debts', debtsReducer),
    EffectsModule.forFeature([ DebtsEffects ]),
  ],
  providers: [
    DebtsService,
  ],
})
export class DebtsModule {}
