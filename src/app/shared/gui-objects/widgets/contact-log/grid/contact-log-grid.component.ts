import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

import { IGridColumn } from '../../../../components/grid/grid.interface';

import { ContactLogService } from '../contact-log.service';
import { GridService } from '../../../../components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-contact-log-grid',
  templateUrl: 'contact-log-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactLogGridComponent implements OnInit {
  @Input('personId') set personId(personId: number) {
    if (personId) {
      this.fetchAll(personId);
    }
  }

  columns: IGridColumn[] = [
    { prop: 'debtId', minWidth: 80 },
    { prop: 'сontractNumber', minWidth: 120 },
    { prop: 'createDateTime', minWidth: 150, renderer: 'dateTimeRenderer' },
    { prop: 'fullName', minWidth: 150 },
    { prop: 'personRole', minWidth: 100, dictCode: UserDictionariesService.DICTIONARY_PERSON_ROLE },
    { prop: 'contactDateTime', minWidth: 150, renderer: 'dateTimeRenderer' },
    { prop: 'contactType', minWidth: 150, dictCode: UserDictionariesService.DICTIONARY_CONTACT_TYPE },
    { prop: 'userFullName', minWidth: 200 },
    { prop: 'resultName', minWidth: 200 },
  ];

  data: any[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactLogService: ContactLogService,
    private gridService: GridService,
  ) {}

  ngOnInit(): void {
    this.gridService.setDictionaryRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = this.gridService.setRenderers(columns);
        this.cdRef.markForCheck();
      });
  }

  onSelect(contact: any): void {

  }

  onDoubleClick(contact: any): void {

  }

  private fetchAll(personId: number): void {
    this.contactLogService.fetchAll(personId).subscribe(data => {
      this.data = data;
      this.cdRef.markForCheck();
    });
  }
}
