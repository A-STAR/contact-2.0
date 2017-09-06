import { Component } from '@angular/core';

import { INode } from '../../../../../shared/gui-objects/container/container.interface';

import { DocumentCardComponent } from '../../../../../shared/gui-objects/widgets/documents/card/document-card.component';

@Component({
  selector: 'app-debtor-document',
  templateUrl: './document.component.html'
})
export class DebtorDocumentComponent {
  static COMPONENT_NAME = 'DebtorDocumentComponent';

  get node(): INode {
    return {
      component: DocumentCardComponent
    };
  }
}
