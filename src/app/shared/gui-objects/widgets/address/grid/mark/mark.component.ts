import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { IGridColumn } from '../../../../../../shared/components/grid/grid.interface';

import { GridService } from '../../../../../../shared/components/grid/grid.service';
import { MarkService } from './mark.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-address-grid-mark',
  templateUrl: './mark.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridMarkComponent implements OnInit {
  @Input() debtorId: number;
  @Input() personId: number;
  @Input() personRole: number;

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  columns: IGridColumn[] = [
    { prop: 'id', minWidth: 75, maxWidth: 150 },
    { prop: 'contract', minWidth: 150, maxWidth: 200 },
    { prop: 'statusCode', minWidth: 150, maxWidth: 200, dictCode: UserDictionariesService.DICTIONARY_VISIT_STATUS },
    { prop: 'debtAmount', minWidth: 150, maxWidth: 200 },
    { prop: 'currencyName', minWidth: 150 },
  ];

  debts: any[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private markService: MarkService,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => {
        this.columns = [ ...columns ];
        this.cdRef.markForCheck();
      });

    this.markService.fetchDebtsForPerson(this.personId, this.personRole, this.debtorId)
      .subscribe(debts => {
        this.debts = debts;
        this.cdRef.markForCheck();
      });
  }

  onSubmit(): void {
    this.submit.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
