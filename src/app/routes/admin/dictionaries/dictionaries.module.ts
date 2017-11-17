import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DictModule } from './dict/dict.module';
import { SharedModule } from '../../../shared/shared.module';
import { TermsModule } from './terms/terms.module';

import { DictionariesService } from './dictionaries.service';

import { DictionariesComponent } from './dictionaries.component';

const routes: Routes = [
  { path: '', component: DictionariesComponent }
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
    DictionariesComponent,
  ],
  providers: [
    DictionariesService
  ]
})
export class DictionariesModule {}
