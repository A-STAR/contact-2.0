import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { filter, first, mergeMap } from 'rxjs/operators';

import { ILinkedContactPerson } from '../contact-select.interface';

import { ContactSelectService } from '../contact-select.service';
import { ContactRegistrationService } from '../../contact-registration.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { Grid2Component } from '../../../../../shared/components/grid2/grid2.component';

import { isEmpty } from '../../../../../core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-contact-registration-contact-select-grid',
  templateUrl: 'contact-select-grid.component.html'
})
export class ContactSelectGridComponent implements OnInit {
  @Input() debtId: number;
  @Input() personId: number;

  @ViewChild(Grid2Component) grid: Grid2Component;

  columns$ = this.gridService.getColumns([
    { dataType: 3, name: 'personFullName' },
    { dataType: 6, name: 'personRole', dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { dataType: 6, name: 'linkTypeCode', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ].map(column => ({ ...column, label: column.name })), {});

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
    return !isEmpty(this.grid && this.grid.selected);
  }

  get person(): any {
    return { personId: this.selectedPerson.personId };
  }

  ngOnInit(): void {
    this.fetch();
  }

  onSelect(): void {
    this.cdRef.markForCheck();
  }

  private get selectedPerson(): ILinkedContactPerson {
    return this.grid && this.grid.selected && this.grid.selected[0] as any;
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