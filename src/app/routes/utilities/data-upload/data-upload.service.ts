
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {
  DataUploaders,
  ICellValue
} from './data-upload.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DataUploader } from './data-uploader';
import { TYPE_CODES } from '@app/core/utils';

/**
 * Spec:       http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=140181557
 * API:        http://confluence.luxbase.int:8090/display/WEB20/Load+Data
 * Validation: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=137723952
 */
@Injectable()
export class DataUploadService {

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

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
    private translateService: TranslateService,
    private valueConverterService: ValueConverterService
  ) {}

  get format(): number {
    return this.currentUploaderType;
  }

  set format(value: number) {
    this.currentUploaderType = !!DataUploadService.UPLOADERS_CONFIG[value] ? value : null;
    if (this.currentUploaderType != null) {
      this.create(this.currentUploaderType);
    }
  }

  get uploader(): DataUploader {
    if (this.currentUploaderType != null) {
      return this.uploaders[this.currentUploaderType] ||
        (this.uploaders[this.currentUploaderType] = this.create(this.currentUploaderType));
    }
  }

  formatCellValue(valueType: TYPE_CODES, value: ICellValue): ICellValue {
    switch (valueType) {
      case TYPE_CODES.DATE:
        return this.valueConverterService.toDateOnly(value as Date);
      case TYPE_CODES.DATETIME:
        return this.valueConverterService.toISO(value as Date);
      case TYPE_CODES.STRING:
      case TYPE_CODES.NUMBER:
      case TYPE_CODES.FLOAT:
        return value === '' ? null : value;
      case TYPE_CODES.BOOLEAN:
      default:
        return value;
    }
  }

  uploaderOfType(uploaderType: DataUploaders): boolean {
    return this.currentUploaderType && this.currentUploaderType === uploaderType;
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
