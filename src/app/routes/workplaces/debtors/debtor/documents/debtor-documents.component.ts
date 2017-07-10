import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAttachment } from '../../../../../shared/components/attachments/attachments.interface';

@Component({
  selector: 'app-debtor-documents',
  templateUrl: './debtor-documents.component.html'
})
export class DebtorDocumentsComponent {

  // TODO(d.maltsev): remove fake attachments, connect to back-end API
  private attachments: Array<IAttachment> = [
    {
      id: 1,
      type: 'PNG',
      name: 'Photo 1',
      description: 'Photo description',
      url: '/api/users/3/photo'
    },
    {
      id: 2,
      type: 'JPEG',
      name: 'Photo 2',
      description: '',
      url: '/api/users/4/photo'
    }
  ];

  get attachments$(): Observable<Array<IAttachment>> {
    return Observable.of(this.attachments);
  }

  onFetch(): void {
    console.log('onFetch()');
  }

  onDelete(attachment: IAttachment): void {
    console.log('onDelete()');
    console.log(attachment);
  }

  onUpload(files: Array<File>): void {
    console.log('onUpload()');
    console.log(files);
  }
}
