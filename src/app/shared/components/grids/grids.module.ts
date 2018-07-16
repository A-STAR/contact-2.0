import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular/main';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { DateTimeModule } from '@app/shared/components/form/datetime/datetime.module';
import { InputModule } from '@app/shared/components/form/input/input.module';

import { MomentModule } from '@app/shared/pipes/moment/moment.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';
import { ToolbarModule } from '@app/shared/components/toolbar/toolbar.module';

import { ContextMenuService } from './context-menu/context-menu.service';
import { GridsDefaultsService } from '@app/shared/components/grids/grids-defaults.service';
import { GridsService } from './grids.service';

// Grids
import { SimpleGridComponent } from './grid/grid.component';

// Renderers
import {
  ActionCheckboxRendererComponent,
  CallbackRendererComponent,
  CheckboxRendererComponent,
  DateRendererComponent,
  DateTimeRendererComponent,
  DictRendererComponent,
  HtmlRendererComponent,
  LookupRendererComponent,
  NumberRendererComponent,
  TickRendererComponent,
  ValueRendererComponent,
} from './renderers';

// Editors

import {
  DateTimeEditComponent,
  ValueEditorComponent,
} from './editors';

// Misc Components
import { GridToolbarComponent } from './toolbar/toolbar.component';
import { EmptyOverlayComponent } from './overlays/empty/empty.component';

@NgModule({
  imports: [
    AgGridModule.withComponents([
      ActionCheckboxRendererComponent,
      CallbackRendererComponent,
      CheckboxRendererComponent,
      DateRendererComponent,
      DateTimeEditComponent,
      DateTimeRendererComponent,
      DictRendererComponent,
      HtmlRendererComponent,
      EmptyOverlayComponent,
      LookupRendererComponent,
      NumberRendererComponent,
      TickRendererComponent,
      ValueRendererComponent,
      ValueEditorComponent,
    ]),
    ButtonModule,
    CheckModule,
    CommonModule,
    DateTimeModule,
    FormsModule,
    InputModule,
    MomentModule,
    SelectModule,
    ToolbarModule,
    TranslateModule,
  ],
  exports: [
    CheckboxRendererComponent,
    ActionCheckboxRendererComponent,
    SimpleGridComponent,
  ],
  declarations: [
    ActionCheckboxRendererComponent,
    CallbackRendererComponent,
    CheckboxRendererComponent,
    DateRendererComponent,
    DateTimeEditComponent,
    DateTimeRendererComponent,
    DictRendererComponent,
    EmptyOverlayComponent,
    GridToolbarComponent,
    HtmlRendererComponent,
    LookupRendererComponent,
    NumberRendererComponent,
    SimpleGridComponent,
    TickRendererComponent,
    ValueRendererComponent,
    ValueEditorComponent,
  ],
  // TODO(d.maltsev): remove entryComponents when all grids are moved into GridsModule
  entryComponents: [
    ActionCheckboxRendererComponent,
    CheckboxRendererComponent,
  ],
  providers: [
    ContextMenuService,
    GridsDefaultsService,
    GridsService,
  ]
})
export class GridsModule {}
