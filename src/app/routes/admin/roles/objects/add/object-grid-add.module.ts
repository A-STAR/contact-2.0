import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../../../../shared/shared.module';

import { ObjectGridEditComponent } from './object-grid-add.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
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
