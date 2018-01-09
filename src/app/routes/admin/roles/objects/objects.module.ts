import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ObjectGridEditModule } from './add/object-grid-add.module';
import { SelectModule } from '../../../../shared/components/form/select/select.module';
import { SharedModule } from '../../../../shared/shared.module';

import { ObjectsService } from './objects.service';

import { ObjectsComponent } from './objects.component';

@NgModule({
  imports: [
    CommonModule,
    ObjectGridEditModule,
    SelectModule,
    SharedModule,
  ],
  exports: [
    ObjectsComponent,
  ],
  declarations: [
    ObjectsComponent,
  ],
  providers: [
    ObjectsService,
  ]
})
export class ObjectModule { }
