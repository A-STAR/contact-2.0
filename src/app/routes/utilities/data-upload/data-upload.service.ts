import { Injectable } from '@angular/core';
import { IAGridRequestParams } from '../../../shared/components/grid2/grid2.interface';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import {
  ICellPayload,
  IErrorsResponse,
  IDataResponse,
  IOpenFileResponse,
} from './data-upload.interface';
import { IMassInfoResponse } from '../../../core/data/data.interface';

@Injectable()
export class DataUploadService {
  format = 1;

  private guid: number;

  private columns = [
    { name: 'Ид', order: 0, typeCode: 1 },
    { name: 'Оператор', order: 1, typeCode: 3 },
    { name: 'Дата платежа', order: 2, typeCode: 2 },
    { name: 'Долг', order: 3, typeCode: 3 },
    { name: 'Статус', order: 4, typeCode: 6, dictCode: 1 },
  ];

  private rows = [
    {
      id: 1,
      cells: [
        { id: 1, value: '1', statusCode: 0, errorMsg: null },
        { id: 2, value: 'Иванов Иван Иванович', statusCode: 0, errorMsg: 'Иванов - нехороший человек.' },
        { id: 3, value: '2017-01-01T15:00:00', statusCode: 0, errorMsg: null },
        { id: 4, value: 'Долг за машину', statusCode: 1, errorMsg: 'Иванов должен денег за машину. Иванов, верни деньги.' },
        { id: 5, value: 1, statusCode: 0, errorMsg: null },
      ]
    },
    {
      id: 2,
      cells: [
        { id: 1, value: '2', statusCode: 0, errorMsg: null },
        { id: 2, value: 'Петров Петр Петрович', statusCode: 2, errorMsg: null },
        { id: 3, value: '2017-02-01T12:30:00', statusCode: 0, errorMsg: null },
        { id: 4, value: 'Долг за квартиру', statusCode: 3, errorMsg: null },
        { id: 5, value: 1, statusCode: 0, errorMsg: null },
      ]
    },
    {
      id: 3,
      cells: [
        { id: 1, value: '3', statusCode: 4, errorMsg: null },
        { id: 2, value: 'Сидоров Сидор Сидорович', statusCode: 5, errorMsg: null },
        { id: 3, value: '2017-03-01T10:45:00', statusCode: 0, errorMsg: null },
        { id: 4, value: 'Долг за яхту', statusCode: 6, errorMsg: null },
        { id: 5, value: 1, statusCode: 0, errorMsg: null },
      ]
    },
  ];

  openFile(file: File): Observable<IOpenFileResponse> {
    // POST /load/debtSetOperator
    return of({
        columns: this.columns,
        guid: 0,
        rows: this.rows,
      })
      .do(response => this.guid = response.guid);
  }

  fetch(params: IAGridRequestParams): Observable<IDataResponse> {
    // POST /load/debtSetOperator/guid/{tempDataGuid}
    // const request = this.gridService.buildRequest(params, {});
    return of({
      rows: this.rows,
    });
  }

  editCell(cell: ICellPayload): Observable<IDataResponse> {
    // PUT /load/debtSetOperator/guid/{tempDataGuid}
    return of({
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
    this.rows = this.rows.filter(row => row.id !== rowId);
    return of(null);
  }

  save(): Observable<IMassInfoResponse> {
    // POST /load/debtSetOperator/guid/{tempDataGuid}/save
    return of({
      success: true,
      massInfo: {
        processed: 1,
        total: 2,
      },
    });
  }

  getErrors(): Observable<IErrorsResponse> {
    // GET /load/debtSetOperator/guid/{tempDataGuid}/error
    return of(null);
  }

  cancel(): Observable<void> {
    // DELETE /load/debtSetOperator/guid/{tempDataGuid}
    return of(null);
  }
}
