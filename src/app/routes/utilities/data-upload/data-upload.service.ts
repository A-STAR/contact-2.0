import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICellPayload, IErrorsResponse, IDataResponse, IOpenFileResponse, IPagingPayload } from './data-upload.interface';

@Injectable()
export class DataUploadService {
  private guid: number;

  openFile(file: File): Observable<IOpenFileResponse> {
    // POST /load/debtSetOperator
    return Observable
      .of({
        columns: [],
        guid: 0,
        rows: [],
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
