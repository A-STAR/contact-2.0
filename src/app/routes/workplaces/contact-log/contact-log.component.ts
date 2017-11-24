import { ChangeDetectionStrategy, Component } from '@angular/core';

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
    { key: 'contactLogPromise', title: labelKey('promise.title') },
    { key: 'contactLogContact', title: labelKey('contact.title') },
    { key: 'contactLogSMS', title: labelKey('sms.title') },
  ];
}
