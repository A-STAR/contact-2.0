import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DictModule } from './dict/dict.module';
import { SharedModule } from '../../../shared/shared.module';
import { TermsModule } from './terms/terms.module';

import { DictAndTermsComponent } from './dict-and-terms.component';

const routes: Routes = [
  { path: '', component: DictAndTermsComponent }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    SharedModule,
    DictModule,
    TermsModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    DictAndTermsComponent,
  ]
})
export class DictionaryModule {
}
