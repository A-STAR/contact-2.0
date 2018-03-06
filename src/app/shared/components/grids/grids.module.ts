import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular/main';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';

import { MomentModule } from '@app/shared/pipes/moment/moment.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { Toolbar2Module } from '@app/shared/components/toolbar-2/toolbar-2.module';

import { ContextMenuService } from './context-menu/context-menu.service';
import { GridsService } from './grids.service';

// Grids
import { SimpleGridComponent } from './grid/grid.component';

// Renderers
import {
  CallbackRendererComponent,
  CheckboxRendererComponent,
  DateRendererComponent,
  DateTimeRendererComponent,
  DictRendererComponent,
  LookupRendererComponent,
  NumberRendererComponent,
  TickRendererComponent,
  ValueRendererComponent,
} from './renderers';

// Misc Components
import { GridToolbarComponent } from './toolbar/toolbar.component';
import { EmptyOverlayComponent } from './overlays/empty/empty.component';

@NgModule({
  imports: [
    AgGridModule.withComponents([
      CallbackRendererComponent,
      CheckboxRendererComponent,
      DateRendererComponent,
      DateTimeRendererComponent,
      DictRendererComponent,
      EmptyOverlayComponent,
      LookupRendererComponent,
      NumberRendererComponent,
      TickRendererComponent,
      ValueRendererComponent,
    ]),
    ButtonModule,
    CheckModule,
    CommonModule,
    FormsModule,
    MomentModule,
    SelectModule,
    Toolbar2Module,
    TranslateModule,
  ],
  exports: [
    CheckboxRendererComponent,
    SimpleGridComponent,
  ],
  declarations: [
    CallbackRendererComponent,
    CheckboxRendererComponent,
    DateRendererComponent,
    DateTimeRendererComponent,
    DictRendererComponent,
    EmptyOverlayComponent,
    GridToolbarComponent,
    LookupRendererComponent,
    NumberRendererComponent,
    SimpleGridComponent,
    TickRendererComponent,
    ValueRendererComponent,
  ],
  // TODO(d.maltsev): remove entryComponents when all grids are moved into GridsModule
  entryComponents: [
    CheckboxRendererComponent,
  ],
  providers: [
    ContextMenuService,
    GridsService,
  ]
})
export class GridsModule {}
