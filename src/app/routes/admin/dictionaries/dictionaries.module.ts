import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttributeModule } from './attribute/attribute.module';
import { DictModule } from './dict/dict.module';
import { SharedModule } from '@app/shared/shared.module';
import { TermsModule } from './terms/terms.module';

import { DictionariesService } from './dictionaries.service';

import { DictionariesComponent } from './dictionaries.component';

const routes: Routes = [
  {
    path: '',
    component: DictionariesComponent,
    data: {
      reuse: true,
    },
  }
];

@NgModule({
  imports: [
    AttributeModule,
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
