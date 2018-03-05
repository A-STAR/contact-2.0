import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAttachment } from './attachment.interface';

import { DataService } from '@app/core/data/data.service';

@Injectable()
export class AttachmentService {
  private baseUrl = '/debts/{debtId}/contactRegistration/{guid}/fileattachments';

  constructor(
    private dataService: DataService,
  ) {}

  create(debtId: number, guid: string, data: Partial<IAttachment>, file: File): Observable<string> {
    return this.dataService
      .createMultipart(this.baseUrl, { debtId, guid }, data, file)
      .map(response => response.data[0].guid);
  }

  delete(debtId: number, guid: string, fileGuid: string): Observable<void> {
    return this.dataService
      .delete(`${this.baseUrl}/{fileGuid}`, { debtId, guid, fileGuid });
  }
}
