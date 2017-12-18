import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { filter, first, mergeMap } from 'rxjs/operators';

import { IContactPerson } from './contact-grid.interface';
import { IGridColumn } from '../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContactGridService } from './contact-grid.service';
import { ContactRegistrationService } from '../contact-registration.service';
import { GridService } from '../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-grid',
  templateUrl: 'contact-grid.component.html'
})
export class ContactGridComponent extends DialogFunctions implements OnInit {
  @Input() debtId: number;
  @Input() personId: number;

  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.onAdd(),
    },
  ];

  columns: IGridColumn[] = [
    { prop: 'personFullName' },
    { prop: 'personRole', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { prop: 'linkTypeCode', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ];

  rows: IContactPerson[] = [];

  dialog: 'add';

  selectedPerson: IContactPerson;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactGridService: ContactGridService,
    private contactRegistrationService: ContactRegistrationService,
    private gridService: GridService,
  ) {
    super();
  }

  get guid(): string {
    return this.contactRegistrationService.guid;
  }

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [ ...columns ];
        this.cdRef.markForCheck();
      });

    this.fetch();
  }

  onSelect(value: IContactPerson): void {
    this.selectedPerson = value;
    this.cdRef.markForCheck();
  }

  onSubmit(person: IContactPerson): void {
    this.rows.push({
      ...person,
      personFullName: [ person.lastName, person.firstName, person.middleName ].filter(Boolean).join(' '),
      // Role = 4 (contact person)
      // See: http://confluence.luxbase.int:8090/pages/viewpage.action?pageId=81002516
      personRole: 4,
    });
    this.setDialog();
    this.cdRef.markForCheck();
  }

  private onAdd(): void {
    this.setDialog('add');
  }

  private fetch(): void {
    this.contactRegistrationService.guid$
      .pipe(
        filter(Boolean),
        first(),
        mergeMap(guid => this.contactGridService.fetchAll(guid, this.debtId, this.personId))
      )
      .subscribe(contacts => {
        this.rows = contacts;
        this.cdRef.markForCheck();
      });
  }
}
