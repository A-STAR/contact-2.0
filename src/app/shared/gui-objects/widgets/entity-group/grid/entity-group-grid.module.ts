import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '../../../../components/dialog/dialog.module';
import { DialogActionModule } from '../../../../components/dialog-action/dialog-action.module';
import { GridModule } from '../../../../components/grid/grid.module';

import { EntityGroupGridComponent } from './entity-group-grid.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DialogActionModule,
    GridModule,
    TranslateModule,
  ],
  exports: [
    EntityGroupGridComponent,
  ],
  declarations: [
    EntityGroupGridComponent,
  ],
  entryComponents: [
    EntityGroupGridComponent,
  ]
})
export class EntityGroupGridModule { }
