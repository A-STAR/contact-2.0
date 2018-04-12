import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class ExcelFilterService {
  constructor(
    private dataService: DataService,
  ) {}

  uploadExcel(file: File, typeCode: number): Observable<string> {
    return this.dataService.createMultipart('/list/filterFile/{typeCode}', { typeCode }, {}, file);
  }
}
