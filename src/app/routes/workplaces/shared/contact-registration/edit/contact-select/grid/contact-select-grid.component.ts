import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { filter, mergeMap } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import { ILinkedContactPerson } from '../contact-select.interface';

import { ContactSelectService } from '../contact-select.service';
import { ContactRegistrationService } from '../../../contact-registration.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { addLabelForEntity } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-contact-registration-contact-select-grid',
  templateUrl: 'contact-select-grid.component.html'
})
export class ContactSelectGridComponent implements OnInit {
  @Input() excludeCurrentPersonId: boolean;

  columns$ = this.gridService.getColumns([
    { dataType: 3, name: 'personFullName' },
    { dataType: 6, dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE, name: 'personRole' },
    { dataType: 6, dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE, name: 'linkTypeCode' },
  ].map(addLabelForEntity('contactPerson')), {});

  person: { personId: number };

  rows: ILinkedContactPerson[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private contactSelectService: ContactSelectService,
    private gridService: GridService,
  ) {}

  get guid(): string {
    return this.contactRegistrationService.guid;
  }

  get isValid(): boolean {
    return this.person && !!this.person.personId;
  }

  ngOnInit(): void {
    this.fetch();
  }

  onSelect(persons: number[]): void {
    this.person = { personId: persons[0] };
  }

  private fetch(): void {
    combineLatest(
      this.contactRegistrationService.guid$,
      this.contactRegistrationService.debtId$,
      this.excludeCurrentPersonId
        ? this.contactRegistrationService.personId$
        : of(1),
    )
    .pipe(
      filter(([ guid, debtId, personId ]) => Boolean(guid && debtId && personId)),
      mergeMap(([ guid, debtId, personId ]) => {
        return this.contactSelectService.fetchAll(guid, debtId, this.excludeCurrentPersonId ? personId : null);
      })
    )
    .subscribe(contacts => {
      this.rows = contacts;
      this.rowCount = contacts.length;
      this.cdRef.markForCheck();
    });
  }
}
