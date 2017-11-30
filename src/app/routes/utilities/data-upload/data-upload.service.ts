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
          { name: 'Ид', order: 0, typeCode: 1, dictCode: null },
          { name: 'Оператор', order: 1, typeCode: 3, dictCode: null },
          { name: 'Долг', order: 2, typeCode: 3, dictCode: null },
        ],
        guid: 0,
        rows: [
          {
            id: 1,
            cells: [
              { id: 1, value: '1', statusCode: 0, errorMsg: null },
              { id: 2, value: 'Иванов Иван Иванович', statusCode: 0, errorMsg: null },
              { id: 3, value: 'Долг за машину', statusCode: 0, errorMsg: null },
            ]
          },
          {
            id: 2,
            cells: [
              { id: 1, value: '2', statusCode: 0, errorMsg: null },
              { id: 2, value: 'Петров Петр Петрович', statusCode: 0, errorMsg: null },
              { id: 3, value: 'Долг за квартиру', statusCode: 0, errorMsg: null },
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
