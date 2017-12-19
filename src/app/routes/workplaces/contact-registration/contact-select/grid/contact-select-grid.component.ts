import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { filter, first, mergeMap } from 'rxjs/operators';

import { IContactSelectPerson } from '../contact-select.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { ContactSelectService } from '../contact-select.service';
import { ContactRegistrationService } from '../../contact-registration.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DialogFunctions } from '../../../../../core/dialog';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-select-grid',
  templateUrl: 'contact-select-grid.component.html'
})
export class ContactSelectGridComponent extends DialogFunctions implements OnInit {
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

  rows: IContactSelectPerson[] = [];

  dialog: 'add';

  selectedPerson: IContactSelectPerson;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private contactSelectService: ContactSelectService,
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

  onSelect(value: IContactSelectPerson): void {
    this.selectedPerson = value;
    this.cdRef.markForCheck();
  }

  onSubmit(person: IContactSelectPerson): void {
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
        mergeMap(guid => this.contactSelectService.fetchAll(guid, this.debtId, this.personId))
      )
      .subscribe(contacts => {
        this.rows = contacts;
        this.cdRef.markForCheck();
      });
  }
}
