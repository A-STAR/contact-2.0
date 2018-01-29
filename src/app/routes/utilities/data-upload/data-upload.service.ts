
import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { IAppState } from '@app/core/state/state.interface';
import {
  DataUploaders,
  ICellValue
} from './data-upload.interface';
import { TColumnType } from '@app/shared/components/grid/grid.interface';

import { AbstractActionService } from '@app/core/state/action.service';
import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import { DataUploader } from './data-uploader';
import * as moment from 'moment';

/**
 * Spec:       http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=140181557
 * API:        http://confluence.luxbase.int:8090/display/WEB20/Load+Data
 * Validation: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=137723952
 */
@Injectable()
export class DataUploadService extends AbstractActionService {

  public static SELECTED_CURRENCY  = 'SELECTED_CURRENCY';

  private static UPLOADERS_CONFIG = {
    [DataUploaders.CURRENCY_RATE]: {
      openFile: '/load/currencies/{currenciesId}/rates',
      fetch: '/load/currencies/{currenciesId}/rates/guid/{guid}',
      editCell: '/load/currencies/{currenciesId}/rates/guid/{guid}',
      deleteRow: '/load/currencies/{currenciesId}/rates/guid/{guid}/row/{rowId}',
      cancel: '/load/currencies/{currenciesId}/rates/guid/{guid}',
      save: '/load/currencies/{currenciesId}/rates/guid/{guid}/save',
      getErrors: '/load/currencies/{currenciesId}/rates/guid/{guid}/error',
      paramKey: 'currenciesId'
    },
    [DataUploaders.CONTACT_HISTORY]: {
      openFile: '/load/contactHistory',
      fetch: '/load/contactHistory/guid/{guid}',
      editCell: '/load/contactHistory/guid/{guid}',
      deleteRow: '/load/contactHistory/guid/{guid}/row/{rowId}',
      cancel: '/load/contactHistory/guid/{guid}',
      save: '/load/contactHistory/guid/{guid}/save',
      getErrors: '/load/contactHistory/guid/{guid}/error'
    },
    [DataUploaders.DEBTS]: {
      openFile: '/load/debts',
      fetch: '/load/debts/guid/{guid}',
      editCell: '/load/debts/guid/{guid}',
      deleteRow: '/load/debts/guid/{guid}/row/{rowId}',
      cancel: '/load/debts/guid/{guid}',
      save: '/load/debts/guid/{guid}/save',
      getErrors: '/load/debts/guid/{guid}/error'
    },
    [DataUploaders.PAYMENT_NEW]: {
      openFile: '/load/payments/format/1',
      fetch: '/load/payments/format/1/guid/{guid}',
      editCell: '/load/payments/format/1/guid/{guid}',
      deleteRow: '/load/payments/format/1/guid/{guid}/row/{rowId}',
      cancel: '/load/payments/format/1/guid/{guid}',
      save: '/load/payments/format/1/guid/{guid}/save',
      getErrors: '/load/payments/format/1/guid/{guid}/error',
    },
    [DataUploaders.PAYMENT_UPDATE]: {
      openFile: '/load/payments/format/2',
      fetch: '/load/payments/format/2/guid/{guid}',
      editCell: '/load/payments/format/2/guid/{guid}',
      deleteRow: '/load/payments/format/2/guid/{guid}/row/{rowId}',
      cancel: '/load/payments/format/2/guid/{guid}',
      save: '/load/payments/format/2/guid/{guid}/save',
      getErrors: '/load/payments/format/2/guid/{guid}/error',
    },
    [DataUploaders.SET_OPERATOR]: {
      openFile: '/load/debtSetOperator',
      fetch: '/load/debtSetOperator/guid/{guid}',
      editCell: '/load/debtSetOperator/guid/{guid}',
      deleteRow: '/load/debtSetOperator/guid/{guid}/row/{rowId}',
      cancel: '/load/debtSetOperator/guid/{guid}',
      save: '/load/debtSetOperator/guid/{guid}/save',
      getErrors: '/load/debtSetOperator/guid/{guid}/error'
    },
  };

  private uploaders = {};

  private currentUploaderType: DataUploaders;

  /**
   * The order of this corresponds dict 62
   * CURRENCY_RATE are not from this dict
   */
  private uploaderTypes = [
    // filler for 0 index
    null,
    DataUploaders.PAYMENT_NEW,
    DataUploaders.PAYMENT_UPDATE,
    DataUploaders.SET_OPERATOR,
    DataUploaders.DEBTS,
    DataUploaders.CONTACT_HISTORY,
    DataUploaders.CURRENCY_RATE
  ];

  constructor(
    protected actions: Actions,
    protected store: Store<IAppState>,
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService
  ) {
    super();
  }

  get format(): number {
    return this.uploaderTypes.indexOf(this.currentUploaderType);
  }

  set format(value: number) {
    this.currentUploaderType = this.uploaderTypes[value];
    this.create(this.currentUploaderType);
  }

  get uploader(): DataUploader {
    return this.uploaders[this.currentUploaderType] ||
      (this.uploaders[this.currentUploaderType] = this.create(this.currentUploaderType));
  }

  formatCellValue(valueType: TColumnType, value: ICellValue): ICellValue {
    switch (valueType) {
      case 'date':
        return moment(value as Date).format('YYYY-MM-DD');
      case 'datetime':
        return moment(value as Date).format('YYYY-MM-DD HH:mm:ss');
      case 'string':
        return value === '' ? null : value;
      case 'boolean':
      case 'number':
      default:
        return value;
    }
  }

  private create(uploaderType: DataUploaders): DataUploader {
    if (!this.uploaders[uploaderType]) {
      // get optional paramKey
      const paramKey = DataUploadService.UPLOADERS_CONFIG[uploaderType]
        && DataUploadService.UPLOADERS_CONFIG[uploaderType].paramKey;
      // create uploader with respective config and paramKey
      this.uploaders[uploaderType] = new DataUploader(
        this.dataService,
        this.gridService,
        this.notificationsService,
        this.translateService,
        DataUploadService.UPLOADERS_CONFIG[uploaderType],
        paramKey);
    }
    return this.uploaders[uploaderType];
  }
}
