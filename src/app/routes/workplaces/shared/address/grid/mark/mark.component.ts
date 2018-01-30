import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { first } from 'rxjs/operators';

import { IAddressMarkData, IDebt } from './mark.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';

import { GridService } from '@app/shared/components/grid/grid.service';
import { MarkService } from './mark.service';
import { UserDictionariesService } from '../../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { GridComponent } from '@app/shared/components/grid/grid.component';

import { makeKey } from '@app/core/utils';

const labelKey = makeKey('widgets.address.dialogs.mark.form');

@Component({
  selector: 'app-address-grid-mark',
  templateUrl: './mark.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridMarkComponent implements OnInit {
  @Input() callCenter: boolean;
  @Input() debtorId: number;
  @Input() personId: number;
  @Input() personRole: number;

  @Output() submit = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(GridComponent) grid: GridComponent;

  columns: IGridColumn[] = [
    { prop: 'id', minWidth: 75, maxWidth: 150 },
    { prop: 'contract', minWidth: 150, maxWidth: 200 },
    { prop: 'statusCode', minWidth: 150, maxWidth: 200, dictCode: UserDictionariesService.DICTIONARY_VISIT_STATUS },
    { prop: 'debtAmount', minWidth: 150, maxWidth: 200 },
    { prop: 'currencyName', minWidth: 150 },
  ];

  debts: IDebt[];

  controls = [
    { controlName: 'purposeCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_VISIT_STATUS },
    { controlName: 'comment', type: 'textarea' },
  ].map(control => ({ ...control, label: labelKey(control.controlName) })) as IDynamicFormItem[];

  private hasSelection = false;

  constructor(
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
    private markService: MarkService,
  ) {}

  ngOnInit(): void {
    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [ ...columns ];
        this.cdRef.markForCheck();
      });

    this.markService.fetchDebtsForPerson(this.personId, this.personRole, this.debtorId, this.callCenter)
      .subscribe(debts => {
        this.debts = debts;
        if (debts.length === 1) {
          this.grid.selected = debts;
          this.hasSelection = true;
        }
        this.cdRef.markForCheck();
      });
  }

  get canSubmit(): boolean {
    return this.hasSelection;
  }

  onSelect(event: IAddressMarkData): void {
    this.hasSelection = this.grid.selected.length > 0;
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    const data = {
      ...this.form.serializedUpdates,
      debtIds: this.grid.selected.map(debt => debt.id),
      personRole: this.personRole
    };
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
