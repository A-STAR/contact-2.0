import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { TranslateModule } from '@ngx-translate/core';
import { BorderLayout, Component, GridPanel } from 'ag-grid';
import { RowGroupCompFactory } from 'ag-grid-enterprise/main';

import { ActionDialogModule } from '../dialog/action/action-dialog.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { SelectModule } from '../form/select/select.module';
// import { Grid2ColumnFilterModule } from './filter/column/grid2-column-filter.module';

import { GridService } from '../grid/grid.service';

import { Grid2Component } from './grid2.component';

@NgModule({
  imports: [
    CommonModule,
    ToolbarModule,
    TranslateModule,
    ActionDialogModule,
    AgGridModule.withComponents([]),
    SelectModule,
    // Grid2ColumnFilterModule,
  ],
  exports: [
    Grid2Component,
  ],
  declarations: [
    Grid2Component,
  ],
  providers: [
    GridService,
  ],
})
export class Grid2Module {
  constructor() {
    // tslint:disable-next-line
    LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_for_Production_100Devs19_July_2017__MTUwMDQxODgwMDAwMA==c8fa1c094c7bd76cddf4297f92d5f8da');
  }
}

// ag-grid patch
const rowGroupCompFactoryCreateFn: Function = RowGroupCompFactory.prototype.create;
RowGroupCompFactory.prototype.create = function (): Component {
  const component = rowGroupCompFactoryCreateFn.apply(this, arguments);
  Reflect.defineProperty(component.params, 'emptyMessage', {
    get: () => component.gridOptionsWrapper.gridOptions.localeText.rowGroupColumnsEmptyMessage
  });
  return component;
};

const overlaysMap = {
  loading: 'loadingOoo',
  noRows: 'noRowsToShow'
};

const showOverlayFn: Function = BorderLayout.prototype.showOverlay;
BorderLayout.prototype.showOverlay = function (key: string): void {
  showOverlayFn.apply(this, arguments);

  const overlay: Element = this.overlays[key];
  if (overlay && this.gridOptionsWrapper) {
    Array.from(overlay.querySelectorAll('.ag-overlay-wrapper')).forEach((el: Element) => {
      el.innerHTML = this.gridOptionsWrapper.gridOptions.localeText[overlaysMap[key]];
    });
  }
};

const initFn: Function = Reflect.get(GridPanel.prototype, 'init');
Reflect.set(GridPanel.prototype, 'init', function (): void {
  initFn.apply(this, arguments);
  this.layout.gridOptionsWrapper = this.gridOptionsWrapper;
});
