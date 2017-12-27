import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { CurrencyEditModule } from './edit/edit.module';

import { CurrenciesComponent } from './currencies.component';
import { CurrencyEditComponent } from './edit/edit.component';

const routes: Routes = [
  { path: '', component: CurrenciesComponent },
  { path: 'create', component: CurrencyEditComponent },
  { path: ':currencyId', component: CurrencyEditComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    CurrencyEditModule,
  ],
  declarations: [
    CurrenciesComponent,
  ],
})
export class CurrenciesModule {}
