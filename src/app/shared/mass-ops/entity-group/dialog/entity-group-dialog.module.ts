import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from '@app/shared/components/dialog/dialog.module';
import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridModule } from '@app/shared/components/grid/grid.module';
import { EntityGroupGridModule } from '../grid/entity-group-grid.module';

import { EntityGroupDialogComponent } from './entity-group-dialog.component';

@NgModule({
  imports: [
    CommonModule,
    DialogModule,
    DialogActionModule,
    GridModule,
    TranslateModule,
    EntityGroupGridModule,
  ],
  exports: [
    EntityGroupDialogComponent,
  ],
  declarations: [
    EntityGroupDialogComponent,
  ],
  entryComponents: [
    EntityGroupDialogComponent,
  ]
})
export class EntityGroupDialogModule { }
