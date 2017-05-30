import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { DictComponent } from './dict.component';
import { DictEditComponent } from './dict-edit/dict-edit.component';
import { DictService } from './dict.service';

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
  ],
  providers: [
    DictService
  ]
})
export class DictModule {
}
