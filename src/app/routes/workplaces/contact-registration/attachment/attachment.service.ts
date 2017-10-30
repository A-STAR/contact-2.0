import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { DataService } from '../../../../core/data/data.service';

@Injectable()
export class AttachmentService {
  private baseUrl = '/debts/{debtId}/contactRequest/{guid}/fileattachments';

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
      .create(this.baseUrl, { debtId, guid }, formData)
      .map(response => response.data[0].guid);
  }

  delete(debtId: number, guid: string, fileGuid: string): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{fileGuid}`, { debtId, guid, fileGuid });
  }
}
