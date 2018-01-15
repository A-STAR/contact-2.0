import { Injectable } from '@angular/core';
import { IAGridRequestParams } from '../../../shared/components/grid2/grid2.interface';
import { Observable } from 'rxjs/Observable';
import { map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';

import {
  ICellPayload,
  IErrorsResponse,
  IDataResponse,
  IOpenFileResponse,
} from './data-upload.interface';
import { IMassInfoResponse } from '../../../core/data/data.interface';

import { DataService } from '../../../core/data/data.service';
import { GridService } from '../../../shared/components/grid/grid.service';
import { NotificationsService } from '../../../core/notifications/notifications.service';

/**
 * Spec:       http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=140181557
 * API:        http://confluence.luxbase.int:8090/display/WEB20/Load+Data
 * Validation: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=137723952
 */
@Injectable()
export class DataUploadService {
  format = 1;

  private guid: number;

  constructor(
    private dataService: DataService,
    private gridService: GridService,
    private notificationsService: NotificationsService,
  ) {}

  openFile(file: File): Observable<IOpenFileResponse> {
    return this.dataService
      .createMultipart('/load/debtSetOperator', {}, {}, file)
      .pipe(
        map(response => response.data[0]),
        tap(data => this.guid = data.guid),
      );
  }

  fetch(params: IAGridRequestParams): Observable<IDataResponse> {
    const { guid } = this;
    const request = this.gridService.buildRequest(params, null);
    return this.dataService
      .create('/load/debtSetOperator/guid/{guid}', { guid }, params);
  }

  editCell(cell: ICellPayload): Observable<IDataResponse> {
    const { guid } = this;
    return this.dataService
      .update('/load/debtSetOperator/guid/{guid}', { guid }, cell)
      .pipe(
        map(response => response.data[0]),
      );
  }

  deleteRow(rowId: number): Observable<void> {
    const { guid } = this;
    return this.dataService
      .delete('/load/debtSetOperator/guid/{guid}/row/{rowId}', { guid, rowId });
  }

  save(): Observable<IMassInfoResponse> {
    const { guid } = this;
    return this.dataService
      .create('/load/debtSetOperator/guid/{guid}/save', { guid }, {});
  }

  getErrors(): Observable<IErrorsResponse> {
    const { guid } = this;
    return this.dataService
      .read('/load/debtSetOperator/guid/{guid}/error', { guid });
  }

  cancel(): Observable<void> {
    const { guid } = this;
    return this.dataService
      .delete('/load/debtSetOperator/guid/{guid}', { guid });
  }
}
