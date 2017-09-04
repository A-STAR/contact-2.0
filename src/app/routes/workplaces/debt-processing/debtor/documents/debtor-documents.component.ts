import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// import { IAttachment } from '../../../../../shared/components/attachments/attachments.interface';
import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { DocumentGridComponent } from '../../../../../shared/gui-objects/widgets/documents/grid/document-grid.component';

@Component({
  selector: 'app-debtor-documents',
  templateUrl: './debtor-documents.component.html'
})
export class DebtorDocumentsComponent {
  static COMPONENT_NAME = 'DebtorDocumentsComponent';

  get node(): INode {
    return {
      component: DocumentGridComponent
    };
  }
}
