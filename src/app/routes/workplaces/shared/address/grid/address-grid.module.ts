import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { BlockDialogModule } from '@app/shared/components/dialog/block/block-dialog.module';
import { DialogActionModule } from '@app/shared/components/dialog-action/dialog-action.module';
import { GridsModule } from '@app/shared/components/grids/grids.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';
import { LetterGenerationModule } from '../letter-generation/letter-generation.module';

import { AddressGridMarkModule } from './mark/mark.module';
import { AddressGridVisitsModule } from './visits/visits.module';

import { AddressGridComponent } from './address-grid.component';

@NgModule({
  imports: [
    AddressGridMarkModule,
    AddressGridVisitsModule,
    BlockDialogModule,
    CommonModule,
    DialogActionModule,
    GridsModule,
    Toolbar2Module,
    TranslateModule,
    LetterGenerationModule,
  ],
  exports: [
    AddressGridComponent,
  ],
  declarations: [
    AddressGridComponent,
  ],
})
export class AddressGridModule {}
