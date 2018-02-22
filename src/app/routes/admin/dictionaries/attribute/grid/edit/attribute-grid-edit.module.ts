import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from '@app/shared/shared.module';

import { AttributeGridEditComponent } from './attribute-grid-edit.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule
  ],
  exports: [
    AttributeGridEditComponent,
  ],
  declarations: [
    AttributeGridEditComponent,
  ],
  entryComponents: [
    AttributeGridEditComponent,
  ]
})
export class AttributeGridEditModule { }
