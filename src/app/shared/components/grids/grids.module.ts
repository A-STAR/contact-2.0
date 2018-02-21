import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular/main';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { MomentModule } from '@app/shared/pipes/moment/moment.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';

import { GridsService } from './grids.service';

// Grids
import { SimpleGridComponent } from './grid/grid.component';

// Renderers
import {
  CheckboxRendererComponent,
  DateRendererComponent,
  DateTimeRendererComponent,
  DictRendererComponent,
  LookupRendererComponent,
  NumberRendererComponent,
  TickRendererComponent,
} from './renderers';

// Misc Components
import { GridToolbarComponent } from './toolbar/toolbar.component';
import { EmptyOverlayComponent } from './overlays/empty/empty.component';

@NgModule({
  imports: [
    AgGridModule.withComponents([
      CheckboxRendererComponent,
      DateRendererComponent,
      DateTimeRendererComponent,
      DictRendererComponent,
      EmptyOverlayComponent,
      LookupRendererComponent,
      NumberRendererComponent,
      TickRendererComponent,
    ]),
    ButtonModule,
    CheckModule,
    CommonModule,
    FormsModule,
    MomentModule,
    SelectModule,
    TranslateModule,
  ],
  exports: [
    CheckboxRendererComponent,
    SimpleGridComponent,
  ],
  declarations: [
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
  ],
  // TODO(d.maltsev): remove entryComponents when all grids are moved into GridsModule
  entryComponents: [
    CheckboxRendererComponent,
  ],
  providers: [
    GridsService,
  ]
})
export class GridsModule {}
