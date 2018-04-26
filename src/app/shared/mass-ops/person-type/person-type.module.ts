import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';

import { PersonTypeComponent } from '@app/shared/mass-ops/person-type/person-type.component';

import { PersonTypeService } from './person-type.service';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    GridsModule,
    TranslateModule
  ],
  declarations: [
    PersonTypeComponent
  ],
  exports: [
    PersonTypeComponent
  ],
  providers: [
    PersonTypeService
  ]
})
export class PersonTypeModule { }
