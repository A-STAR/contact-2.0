import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Component({
  selector: 'app-contact-log-tab',
  templateUrl: './contact-log-tab.component.html'
})
export class DebtorContactLogTabComponent {
  static COMPONENT_NAME = 'DebtorContactLogTabComponent';

  private routeParams = (this.route.params as BehaviorSubject<any>).value;

  constructor(
    private route: ActivatedRoute,
  ) {}

  get contactId(): number {
    return this.routeParams.contactLogId;
  }

  get debtId(): number {
    return this.routeParams.debtId;
  }

  get contactLogType(): number {
    return this.routeParams.contactLogType;
  }
}
