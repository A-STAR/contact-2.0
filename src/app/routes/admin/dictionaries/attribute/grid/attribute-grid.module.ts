import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { AttributeGridEditModule } from '../grid/edit/attribute-grid-edit.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { SharedModule } from '@app/shared/shared.module';

import { AttributeGridComponent } from '../grid/attribute-grid.component';

@NgModule({
  imports: [
    AttributeGridEditModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    SelectModule,
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
