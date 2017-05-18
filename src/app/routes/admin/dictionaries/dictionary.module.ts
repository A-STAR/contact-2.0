import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SharedModule } from '../../../shared/shared.module';
import { DictAndTermsComponent } from './dict-and-terms.component';
import { DictModule } from './dict/dict.module';
import { TermsModule } from './terms/terms.module';

const routes: Routes = [
  {path: '', component: DictAndTermsComponent},
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
