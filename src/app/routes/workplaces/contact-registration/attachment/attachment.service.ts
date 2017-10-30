import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class AttachmentService {
  constructor(
    private dataService: DataService,
  ) {}

  create(debtId: number, guid: string, data: any, file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    const properties = new Blob(
      [ JSON.stringify({ ...data, fileName: file.name }) ],
      { type: 'application/json;charset=UTF-8' }
    );
    formData.append('properties', properties);
    return this.dataService
      // TODO(d.maltsev): error handling
      .create('/debts/{debtId}/contactRequest/{guid}/fileattachments', { debtId, guid }, formData)
      .map(response => response.data[0].guid);
  }
}
