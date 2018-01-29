import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { IAGridRequestParams } from '@app/shared/components/grid2/grid2.interface';
import {
  IDataUploaderConfig,
  IOpenFileResponse,
  IDataResponse,
  ICellPayload,
} from './data-upload.interface';
import { IMassInfoResponse } from '@app/core/data/data.interface';

import { DataService } from '@app/core/data/data.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

import * as moment from 'moment';

export class DataUploader {
  private static DEFAULT_FILE_EXT = 'xlsx';
  private static FILE_DATETIME_FORMAT = 'YYYY:MM:DD_HH:mm:ss';

  public guid: number;
  public parameter: any;

  private _fileName: string;
  private _fileExt: string;

  constructor(
    public dataService: DataService,
    public gridService: GridService,
    public notificationsService: NotificationsService,
    public translateService: TranslateService,
    public api: IDataUploaderConfig,
    private paramKey?: string,
  ) { }

  openFile(file: File): Observable<IOpenFileResponse> {
    this.fileName = file.name;
    return this.dataService
      .createMultipart(this.api.openFile, this.buildRequestParams(), {}, file)
      .catch(this.notificationsService.error('modules.dataUpload.errors.openFile').dispatchCallback())
      .pipe(
      map(response => response.data[0]),
      tap(data => this.guid = data.guid),
    );
  }

  fetch(params: IAGridRequestParams): Observable<IDataResponse> {
    const request = this.gridService.buildRequest(params, null);
    return this.dataService
      .create(this.api.fetch, this.buildRequestParams(), request)
      .catch(this.notificationsService.error('modules.dataUpload.errors.fetch').dispatchCallback())
      .pipe(
        map(response => response.data[0])
      );
  }

  editCell(cell: ICellPayload): Observable<IDataResponse> {
    return this.dataService
      .update(this.api.editCell, this.buildRequestParams(), cell)
      .catch(this.notificationsService.error('modules.dataUpload.errors.editCell').dispatchCallback())
      .pipe(
      map(response => response.data[0]),
    );
  }

  deleteRow(rowId: number): Observable<void> {
    return this.dataService
      .delete(this.api.deleteRow, this.buildRequestParams(rowId))
      .catch(this.notificationsService.error('modules.dataUpload.errors.deleteRow').dispatchCallback());
  }

  save(): Observable<IMassInfoResponse> {
    return this.dataService
      .create(this.api.save, this.buildRequestParams(), {})
      .catch(this.notificationsService.error('modules.dataUpload.errors.save').dispatchCallback());
  }

  getErrors(): string {
    const url = this.parameter == null ? this.api.getErrors :
      this.api.getErrors.replace(new RegExp('\\{' + this.paramKey + '\\}'), this.parameter);
    return this.guid ? url.replace(/(guid\/)(\{[\w]+\})(.*)/g, `$1${this.guid}$3`) : url;
  }

  get fileName(): string {
    return `${this._fileName}.${this._fileExt}`;
  }

  set fileName(value: string) {
    const lastIndex = value.lastIndexOf('.');
    this._fileName = value.substr(0, lastIndex);
    this._fileExt = value.substr(lastIndex + 1);
  }

  get errorFileName(): string {
    // can't use string templates because of newlines
    return (this._fileName || '') +
      '_' + moment().format(DataUploader.FILE_DATETIME_FORMAT) +
      '_' + this.translateService.instant('modules.dataUpload.errors.errorFile') +
      '.' + (this._fileExt || DataUploader.DEFAULT_FILE_EXT);
  }

  cancel(): Observable<void> {
    this.fileName = '';
    return this.dataService
      .delete(this.api.cancel, this.buildRequestParams())
      .catch(this.notificationsService.error('modules.dataUpload.errors.cancel').dispatchCallback());
  }

  private buildRequestParams(rowId?: number): object {
    const result = {} as any;
    if (this.guid) {
      result.guid = this.guid;
    }
    if (this.parameter && this.paramKey) {
      result[this.paramKey] = this.parameter;
    }
    if (rowId) {
      result.rowId = rowId;
    }
    return result;
  }
}
