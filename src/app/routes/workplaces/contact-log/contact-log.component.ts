import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ContactsGridKeys } from './contact-log.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.contactLog');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-log',
  host: { class: 'full-size' },
  templateUrl: 'contact-log.component.html',
})
export class ContactLogComponent {
  grids = [
    {
      key: ContactsGridKeys.PROMISE,
      title: label('promise.title'),
      rowIdKey: 'promiseId',
      isInitialised: false,
      permission: this.userPermissionsService.has('CONTACT_LOG_TAB_PROMISE')
    },
    {
      key: ContactsGridKeys.CONTACT,
      title: label('contact.title'),
      rowIdKey: 'contactId',
      isInitialised: false,
      permission: this.userPermissionsService.has('CONTACT_LOG_TAB_CONTACT')
    },
    {
      key: ContactsGridKeys.SMS,
      title: label('sms.title'),
      rowIdKey: 'smsId',
      isInitialised: false,
      permission: this.userPermissionsService.has('CONTACT_LOG_TAB_SMS')
    },
    {
      key: ContactsGridKeys.EMAIL,
      title: label('email.title'),
      rowIdKey: 'emailId',
      isInitialised: false,
      permission: this.userPermissionsService.has('CONTACT_LOG_TAB_EMAIL')
    },
  ];

  constructor(
    private userPermissionsService: UserPermissionsService
  ) { }

  onTabSelect(tabIndex: number): void {
    // NOTE: sometimes the framework passes an MouseEvent here
    if (Number.isInteger(tabIndex)) {
      this.grids[tabIndex].isInitialised = true;
    }
  }
}
