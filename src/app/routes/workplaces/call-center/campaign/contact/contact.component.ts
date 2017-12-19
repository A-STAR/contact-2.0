import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-call-center-contact',
  templateUrl: 'contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  static COMPONENT_NAME = 'ContactLogComponent';

  constructor(
    private route: ActivatedRoute,
  ) {}

  get contactId(): number {
    return Number(this.route.snapshot.paramMap.get('contactId'));
  }

  get debtId(): number {
    return Number(this.route.snapshot.paramMap.get('debtId'));
  }

  get contactLogType(): number {
    return Number(this.route.snapshot.paramMap.get('contactType'));
  }
}
