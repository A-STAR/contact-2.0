import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';

import { ButtonModule } from '@app/shared/components/button/button.module';
import { CheckModule } from '@app/shared/components/form/check/check.module';
import { SelectModule } from '@app/shared/components/form/select/select.module';

import { GridsService } from './grids.service';

// Grids
import { SimpleGridComponent } from './grid/grid.component';

// Renderers
import { CheckboxCellRendererComponent } from './renderers/checkbox/checkbox.component';
import { DictRendererComponent } from './renderers/dict/dict.component';
import { LookupRendererComponent } from './renderers/lookup/lookup.component';

// Misc Components
import { GridToolbarComponent } from './toolbar/toolbar.component';

@NgModule({
  imports: [
    AgGridModule.withComponents([
      CheckboxCellRendererComponent,
      DictRendererComponent,
      LookupRendererComponent,
    ]),
    ButtonModule,
    CheckModule,
    CommonModule,
    FormsModule,
    SelectModule,
    TranslateModule,
  ],
  exports: [
    CheckboxCellRendererComponent,
    SimpleGridComponent,
  ],
  declarations: [
    CheckboxCellRendererComponent,
    DictRendererComponent,
    GridToolbarComponent,
    LookupRendererComponent,
    SimpleGridComponent,
  ],
  // TODO(d.maltsev): remove entryComponents when all grids are moved into GridsModule
  entryComponents: [
    CheckboxCellRendererComponent,
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
