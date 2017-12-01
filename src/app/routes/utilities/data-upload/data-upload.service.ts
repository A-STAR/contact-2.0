import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';

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

  private columns = [
    { name: 'Ид', order: 0, typeCode: 1, dictCode: null },
    { name: 'Оператор', order: 1, typeCode: 3, dictCode: null },
    { name: 'Долг', order: 2, typeCode: 3, dictCode: null },
  ];

  private rows = [
    {
      id: 1,
      cells: [
        { id: 1, value: '1', statusCode: 0, errorMsg: null },
        { id: 2, value: 'Иванов Иван Иванович', statusCode: 0, errorMsg: 'Иванов - нехороший человек.' },
        { id: 3, value: 'Долг за машину', statusCode: 1, errorMsg: 'Иванов должен денег за машину. Иванов, верни деньги.' },
      ]
    },
    {
      id: 2,
      cells: [
        { id: 1, value: '2', statusCode: 0, errorMsg: null },
        { id: 2, value: 'Петров Петр Петрович', statusCode: 2, errorMsg: null },
        { id: 3, value: 'Долг за квартиру', statusCode: 3, errorMsg: null },
      ]
    },
    {
      id: 3,
      cells: [
        { id: 1, value: '3', statusCode: 4, errorMsg: null },
        { id: 2, value: 'Сидоров Сидор Сидорович', statusCode: 5, errorMsg: null },
        { id: 3, value: 'Долг за яхту', statusCode: 6, errorMsg: null },
      ]
    },
  ];

  openFile(file: File): Observable<IOpenFileResponse> {
    // POST /load/debtSetOperator
    return Observable
      .of({
        columns: this.columns,
        guid: 0,
        rows: this.rows,
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
    return Observable.of({
      rows: this.rows
        .filter(r => r.id === cell.rowId)
        .map(r => ({
          ...r,
          cells: r.cells.map(c => c.id === cell.cellId ? { ...c, value: cell.value } : c),
        })),
    });
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
