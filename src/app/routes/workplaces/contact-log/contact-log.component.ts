import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactsGridKeys } from './contact-log.interface';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.contactLog');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-log',
  host: { class: 'full-height' },
  templateUrl: 'contact-log.component.html',
})
export class ContactLogComponent {
  grids = [
    { key: ContactsGridKeys.PROMISE, title: label('promise.title'), rowIdKey: 'promiseId', isInitialised: true },
    { key: ContactsGridKeys.CONTACT, title: label('contact.title'), rowIdKey: 'contactId', isInitialised: false },
    { key: ContactsGridKeys.SMS, title: label('sms.title'), rowIdKey: 'smsId', isInitialised: false },
    { key: ContactsGridKeys.EMAIL, title: label('email.title'), rowIdKey: 'emailId', isInitialised: false },
  ];

  onTabSelect(tabIndex: number): void {
    // NOTE: sometimes the framework passes an MouseEvent here
    if (Number.isInteger(tabIndex)) {
      this.grids[tabIndex].isInitialised = true;
    }
  }
}
