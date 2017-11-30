import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  ICellPayload,
  IErrorsResponse,
  IDataResponse,
  IOpenFileResponse,
  IPagingPayload,
} from './data-upload.interface';

@Injectable()
export class DataUploadService {
  private guid: number;

  openFile(file: File): Observable<IOpenFileResponse> {
    // POST /load/debtSetOperator
    return Observable
      .of({
        columns: [
          { name: 'id', order: 0, typeCode: 1, dictCode: null },
          { name: 'name', order: 1, typeCode: 3, dictCode: null },
          { name: 'debt', order: 2, typeCode: 3, dictCode: null },
        ],
        guid: 0,
        rows: [
          {
            id: 1,
            cells: [
              { id: 1, value: '1', statusCode: 0, errorMsg: null },
              { id: 2, value: 'Foo', statusCode: 0, errorMsg: null },
              { id: 3, value: 'Debt 1', statusCode: 0, errorMsg: null },
            ]
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '2', statusCode: 0, errorMsg: null },
              { id: 2, value: 'Bar', statusCode: 0, errorMsg: null },
              { id: 3, value: 'Debt 2', statusCode: 0, errorMsg: null },
            ]
          },
        ],
      })
      .do(response => this.guid = response.guid);
  }

  fetch(pagingParams: IPagingPayload): Observable<IDataResponse> {
    // POST /load/debtSetOperator/guid/{tempDataGuid}
    return Observable.of({
      rows: [],
    });
  }

  editCell(cell: ICellPayload): Observable<IDataResponse> {
    // PUT /load/debtSetOperator/guid/{tempDataGuid}
    return Observable.of();
  }

  deleteRow(rowId: number): Observable<void> {
    // DELETE /load/debtSetOperator/guid/{tempDataGuid}/row/{rowIds}
    return Observable.of();
  }

  save(): Observable<void> {
    // POST /load/debtSetOperator/guid/{tempDataGuid}/save
    return Observable.of();
  }

  getErrors(): Observable<IErrorsResponse> {
    // GET /load/debtSetOperator/guid/{tempDataGuid}/error
    return Observable.of();
  }

  cancel(): Observable<void> {
    // DELETE /load/debtSetOperator/guid/{tempDataGuid}
    return Observable.of();
  }
}
