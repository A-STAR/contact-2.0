import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-call-center-document',
  templateUrl: 'document.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentComponent {
  static COMPONENT_NAME = 'DebtorDocumentComponent';
}
