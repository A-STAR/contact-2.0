import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttributesModule } from './attributes/attributes.module';
import { DictModule } from './dict/dict.module';
import { SharedModule } from '../../../shared/shared.module';
import { TermsModule } from './terms/terms.module';

import { DictionariesComponent } from './dictionaries.component';

const routes: Routes = [
  { path: '', component: DictionariesComponent }
];

@NgModule({
  imports: [
    AttributesModule,
    RouterModule.forChild(routes),
    SharedModule,
    DictModule,
    TermsModule,
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    DictionariesComponent,
  ]
})
export class DictionariesModule {}
