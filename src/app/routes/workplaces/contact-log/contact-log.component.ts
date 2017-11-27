import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactsGridKeys } from './contact-log.interface';

import { makeKey } from '../../../core/utils';

const labelKey = makeKey('modules.contactLog');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-log',
  templateUrl: 'contact-log.component.html',
})
export class ContactLogComponent {
  static COMPONENT_NAME = 'ContactLogComponent';

  grids = [
    { key: ContactsGridKeys.PROMISE, title: labelKey('promise.title') },
    { key: ContactsGridKeys.CONTACT, title: labelKey('contact.title') },
    { key: ContactsGridKeys.SMS, title: labelKey('sms.title') },
  ];
}
