import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-call-center-contact',
  templateUrl: 'contact.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactComponent {
  static COMPONENT_NAME = 'ContactLogComponent';

  private routeParams = (this.route.params as BehaviorSubject<any>).value;

  constructor(
    private route: ActivatedRoute,
  ) {}

  get contactId(): number {
    return this.routeParams.contactId;
  }

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get contactLogType(): number {
    return this.routeParams.contactType;
  }
}
