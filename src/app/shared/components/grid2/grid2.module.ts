import { NgModule } from '@angular/core';
import { CommonModule} from '@angular/common';
// TODO(d.maltsev): do we need this???
import { FormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular/main';
import { LicenseManager } from 'ag-grid-enterprise/main';
import { TranslateModule } from '@ngx-translate/core';
// import { BorderLayout, Component, GridPanel } from 'ag-grid';
// import { RowGroupCompFactory } from 'ag-grid-enterprise/main';

import { ActionDialogModule } from '../dialog/action/action-dialog.module';
import { DatePickerModule } from '../form/datepicker/datepicker.module';
import { DialogModule } from '../dialog/dialog.module';
import { ToolbarModule } from '../toolbar/toolbar.module';
import { SelectModule } from '../form/select/select.module';

import { ContactLogService } from './contact-log/contact-log.service';
import { GridService } from '../grid/grid.service';

import { ContactLogDialogComponent } from './contact-log/dialog/contact-log-dialog.component';
import { ContactLogGridComponent } from './contact-log/grid/contact-log-grid.component';
import { Grid2Component } from './grid2.component';
import { GridDatePickerComponent } from './datepicker/grid-date-picker.component';

@NgModule({
  imports: [
    ActionDialogModule,
    AgGridModule.withComponents([
      GridDatePickerComponent
    ]),
    CommonModule,
    DatePickerModule,
    DialogModule,
    FormsModule,
    SelectModule,
    ToolbarModule,
    TranslateModule,
  ],
  exports: [
    Grid2Component,
  ],
  declarations: [
    ContactLogDialogComponent,
    ContactLogGridComponent,
    Grid2Component,
    GridDatePickerComponent,
  ],
  providers: [
    ContactLogService,
    GridService,
  ],
})
export class Grid2Module {
  constructor() {
    // tslint:disable-next-line
    LicenseManager.setLicenseKey('ag-Grid_Evaluation_License_Not_for_Production_100Devs2_August_2017__MTUwMTYyODQwMDAwMA==f340cff658f8e3245fee29659b49a674');
  }
}

// ag-grid patch
// const rowGroupCompFactoryCreateFn: Function = RowGroupCompFactory.prototype.create;
// RowGroupCompFactory.prototype.create = function (): Component {
//   const component = rowGroupCompFactoryCreateFn.apply(this, arguments);
//   Reflect.defineProperty(component.params, 'emptyMessage', {
//     get: () => component.gridOptionsWrapper.gridOptions.localeText.rowGroupColumnsEmptyMessage
//   });
//   return component;
// };

// const overlaysMap = {
//   // NOTE: the `loading` thing never renders. why?
//   loading: 'loadingOoo',
//   noRows: 'noRowsToShow'
// };

// const showOverlayFn: Function = BorderLayout.prototype.showOverlay;
// BorderLayout.prototype.showOverlay = function (key: string): void {
//   showOverlayFn.apply(this, arguments);

//   const overlay: Element = this.overlays[key];
//   if (overlay && this.gridOptionsWrapper) {
//     Array.from(overlay.querySelectorAll('.ag-overlay-wrapper')).forEach((el: Element) => {
//       el.innerHTML = this.gridOptionsWrapper.gridOptions.localeText[overlaysMap[key]];
//     });
//   }
// };

// const initFn: Function = Reflect.get(GridPanel.prototype, 'init');
// Reflect.set(GridPanel.prototype, 'init', function (): void {
//   initFn.apply(this, arguments);
//   this.layout.gridOptionsWrapper = this.gridOptionsWrapper;
// });
