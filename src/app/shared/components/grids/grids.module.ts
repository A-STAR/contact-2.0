import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { MomentModule } from '@app/shared/pipes/moment/moment.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';

import { GridsService } from './grids.service';

// Grids
import { SimpleGridComponent } from './grid/grid.component';

// Renderers
import { CheckboxRendererComponent } from './renderers/checkbox/checkbox.component';
import { DateTimeRendererComponent } from './renderers/datetime/datetime.component';
import { DictRendererComponent } from './renderers/dict/dict.component';
import { LookupRendererComponent } from './renderers/lookup/lookup.component';
import { TickRendererComponent } from './renderers/tick/tick.component';

// Misc Components
import { GridToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [
    AgGridModule.withComponents([
      CheckboxRendererComponent,
      DateTimeRendererComponent,
      DictRendererComponent,
      LookupRendererComponent,
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
    DateTimeRendererComponent,
    DictRendererComponent,
    GridToolbarComponent,
    LookupRendererComponent,
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
export class GridsModule {
  constructor() {
    // tslint:disable-next-line
    LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Key_Not_for_Production_100Devs2_April_2018__MTUyMjYyMzYwMDAwMA==e8bb27c4f0c9ed34bce6c68b868694f2');
  }
}
