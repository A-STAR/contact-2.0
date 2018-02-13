import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ButtonModule } from '../../../../components/button/button.module';
import { DynamicFormModule } from '../../../../components/form/dynamic-form/dynamic-form.module';
import { Grid2Module } from '../../../../components/grid2/grid2.module';
import { PersonSelectDialogModule } from '../dialog/person-select-dialog.module';
import { Toolbar2Module } from '../../../../components/toolbar-2/toolbar-2.module';

import { PersonSelectGridComponent } from './person-select-grid.component';

@NgModule({
  imports: [
    CommonModule,
    ButtonModule,
    DynamicFormModule,
    TranslateModule,
    Grid2Module,
    PersonSelectDialogModule,
    Toolbar2Module,
  ],
  exports: [
    PersonSelectGridComponent,
  ],
  declarations: [
    PersonSelectGridComponent,
  ],
  entryComponents: [
    PersonSelectGridComponent,
  ]
})
export class PersonSelectGridModule { }
