import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { IGridControl } from './excel-filter.interface';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class ExcelFilterService {
  constructor(
    private dataService: DataService,
  ) {}

  uploadExcel(file: File, typeCode: number): Observable<IGridControl> {
    return this.dataService.createMultipart('/list/filterFile/{typeCode}', { typeCode }, {}, file).pipe(
      map(response => response.data[0]),
      // TODO(d.maltsev): error handling
    );
  }
}
