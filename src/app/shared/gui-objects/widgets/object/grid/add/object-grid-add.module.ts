import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../../components/dialog/dialog.module';
import { GridModule } from '../../../../../components/grid/grid.module';

import { ObjectGridEditComponent } from './object-grid-add.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    GridModule,
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
