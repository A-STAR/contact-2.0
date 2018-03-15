import { NgModule } from '@angular/core';

import { AttributeGridEditModule } from './edit/attribute-grid-edit.module';
import { AttributeVersionModule } from './version/attribute-version.module';
import { SharedModule } from '@app/shared/shared.module';

import { AttributeGridComponent } from './attribute-grid.component';
import { AttributeVersionComponent } from './version/attribute-version.component';


@NgModule({
  imports: [
    AttributeGridEditModule,
    AttributeVersionModule,
    SharedModule,
  ],
  exports: [
    AttributeGridComponent,
    AttributeVersionComponent
  ],
  declarations: [
    AttributeGridComponent,
  ],
  entryComponents: [
    AttributeGridComponent,
  ]
})
export class AttributeGridModule { }
