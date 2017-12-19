import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { filter, first, mergeMap } from 'rxjs/operators';

import { IContactSelectPerson } from '../contact-select.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { ContactSelectService } from '../contact-select.service';
import { ContactRegistrationService } from '../../contact-registration.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-select-grid',
  templateUrl: 'contact-select-grid.component.html'
})
export class ContactSelectGridComponent implements OnInit {
  @Input() debtId: number;
  @Input() personId: number;

  columns: IGridColumn[] = [
    { prop: 'personFullName' },
    { prop: 'personRole', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { prop: 'linkTypeCode', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ];

  rows: IContactSelectPerson[] = [];

  selectedPerson: IContactSelectPerson;

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactRegistrationService: ContactRegistrationService,
    private contactSelectService: ContactSelectService,
    private gridService: GridService,
  ) {}

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
