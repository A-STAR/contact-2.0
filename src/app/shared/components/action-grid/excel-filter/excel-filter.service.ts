import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { catchError, map } from 'rxjs/operators';

import { IGridControl } from './excel-filter.interface';

import { DataService } from '@app/core/data/data.service';
import { NotificationsService } from '@app/core/notifications/notifications.service';

@Injectable()
export class ExcelFilterService {
  constructor(
    private dataService: DataService,
    private notificationsService: NotificationsService,
  ) {}

  uploadExcel(file: File, typeCode: number): Observable<IGridControl> {
    return this.dataService.createMultipart('/list/filterFile/{typeCode}', { typeCode }, {}, file).pipe(
      map(response => response.data[0]),
      catchError(this.notificationsService.error('shared.components.actionGrid.excelFilter.uploadError').dispatchCallback()),
    );
  }
}
