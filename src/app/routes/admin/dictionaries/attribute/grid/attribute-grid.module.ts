import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AttributeGridEditModule } from '../grid/edit/attribute-grid-edit.module';
import { SharedModule } from '@app/shared/shared.module';

import { AttributeGridComponent } from '../grid/attribute-grid.component';

@NgModule({
  imports: [
    AttributeGridEditModule,
    FormsModule,
    SharedModule
  ],
  exports: [
    AttributeGridComponent,
  ],
  declarations: [
    AttributeGridComponent,
  ],
  entryComponents: [
    AttributeGridComponent,
  ]
})
export class AttributeGridModule { }
