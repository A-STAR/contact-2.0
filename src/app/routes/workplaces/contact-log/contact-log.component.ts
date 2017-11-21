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
    // TODO(d.maltsev): correct keys
    { key: /* 'contactLogPromise' */ 'debtsprocessingall', title: labelKey('promise.title') },
    // { key: /* 'contactLogContact' */ 'debtsprocessingall', title: labelKey('contact.title') },
    // { key: /* 'contactLogSMS' */ 'debtsprocessingall', title: labelKey('sms.title') },
  ];
}
