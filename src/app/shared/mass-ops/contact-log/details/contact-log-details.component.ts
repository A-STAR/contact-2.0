import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { IContact } from '../contact-log.interface';
import { IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IUserTerm, IUserDictionaries } from '@app/core/user/dictionaries/user-dictionaries.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';
import { ContactLogDetailsService } from './contact-log-details.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-contact-log-details',
  templateUrl: './contact-log-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./contact-log-details.component.scss']
})
export class ContactLogDetailsComponent {

  @Input()
  set actionData(action: IGridAction) {
    this.personId = this.actionGridService.buildRequest(action.payload).personId;
    this.contacts$ = combineLatest(
            this.userDictionariesService
            .getDictionaries([
              UserDictionariesService.DICTIONARY_PERSON_ROLE,
              UserDictionariesService.DICTIONARY_CONTACT_TYPE,
              UserDictionariesService.DICTIONARY_SMS_STATUS,
              UserDictionariesService.DICTIONARY_EMAIL_STATUS,
            ]),
            this.contactLogDetailsService.fetchAll(this.personId)
          )
          .map(([dicts, response]) => {
            this.dicts = dicts;
            return this.processContacts(response.data);
          });
  }

  @Input()
  set rowData(row: any) {
    this.contactFullName = row.personFullName || '';
  }

  columnIds = [
    'contactDateTime',
    'contactType',
    'msgStatusCode',
    'contract',
    'createDateTime',
    'personRole',
    'resultName',
    'promiseDate',
    'userFullName',
  ];

  dicts: IUserDictionaries;

  contactFullName;

  constructor(
    private actionGridService: ActionGridService,
    private contactLogDetailsService: ContactLogDetailsService,
    private userDictionariesService: UserDictionariesService,
  ) { }

  private personId: number;
  contacts$: Observable<any[]>;

  private getContactType(item: IContact): IUserTerm[] {
    switch (item.contactType) {
      case 4:
        return this.dicts[UserDictionariesService.DICTIONARY_SMS_STATUS];
      case 6:
        return this.dicts[UserDictionariesService.DICTIONARY_EMAIL_STATUS];
      default:
        return null;
    }
  }

  private processContact(propName: string, contact: IContact): string {
    switch (propName) {
      case 'personRole':
        return this.dicts[UserDictionariesService.DICTIONARY_PERSON_ROLE].find(term => term.code === contact[propName]).name;
      case 'msgStatusCode':
        const dict = this.getContactType(contact);
        return dict ? dict.find(term => term.code === contact[propName]).name : contact[propName];
      case 'contactType':
        return this.dicts[UserDictionariesService.DICTIONARY_CONTACT_TYPE].find(term => term.code === contact[propName]).name;
      default:
        return contact[propName];
    }
  }

  private processContacts(contacts: IContact[]): any {
    return contacts.map(contact => Object.keys(contact)
      .filter(key => this.columnIds.includes(key))
      .reduce((acc, propName) => (
        {
          ...acc,
          [propName]: this.processContact(propName, contact)
        }
      ), {})
    );
  }

}
