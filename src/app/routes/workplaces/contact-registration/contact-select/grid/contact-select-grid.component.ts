import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { filter, first, mergeMap } from 'rxjs/operators';

import { IContactSelectPerson } from '../contact-select.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { ContactSelectService } from '../contact-select.service';
import { ContactRegistrationService } from '../../contact-registration.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-contact-registration-contact-select-grid',
  styleUrls: [ 'contact-select-grid.component.scss' ],
  templateUrl: 'contact-select-grid.component.html'
})
export class ContactSelectGridComponent implements OnInit {
  @Input() debtId: number;
  @Input() personId: number;

  columns$ = this.gridService.getColumns([
    { dataType: 1, name: 'personFullName' },
    { dataType: 6, name: 'personRole', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { dataType: 6, name: 'linkTypeCode', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ].map(column => ({ ...column, label: column.name })), {});

  rows: IContactSelectPerson[] = [];
  rowCount = 0;
  rowIdKey = 'id';

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
        this.rowCount = contacts.length;
        this.cdRef.markForCheck();
      });
  }
}
