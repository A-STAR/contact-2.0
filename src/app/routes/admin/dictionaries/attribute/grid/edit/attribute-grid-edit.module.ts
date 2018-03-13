import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { AttributeGridEditComponent } from './attribute-grid-edit.component';

@NgModule({
  imports: [
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
