import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '../../../../../shared/shared.module';

import { ObjectGridEditComponent } from './object-grid-add.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    TranslateModule,
  ],
  exports: [
    ObjectGridEditComponent,
  ],
  declarations: [
    ObjectGridEditComponent,
  ],
  entryComponents: [
    ObjectGridEditComponent,
  ]
})
export class ObjectGridEditModule { }
