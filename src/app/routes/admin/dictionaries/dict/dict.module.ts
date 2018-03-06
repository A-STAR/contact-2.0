import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { DictComponent } from './dict.component';
import { DictEditComponent } from './dict-edit/dict-edit.component';

@NgModule({
  imports: [
    SharedModule,
  ],
  exports: [
    DictComponent,
  ],
  declarations: [
    DictComponent,
    DictEditComponent,
  ]
})
export class DictModule {
}
