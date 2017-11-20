import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-log',
  templateUrl: 'contact-log.component.html',
})
export class ContactLogComponent {
  static COMPONENT_NAME = 'ContactLogComponent';
}
