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

import { IDebt } from './mark.interface';
import { IDynamicFormItem } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { MarkService } from './mark.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, addGridLabel, isEmpty } from '@app/core/utils';

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

  columns: ISimpleGridColumn<IDebt>[] = [
    { prop: 'id', minWidth: 75, maxWidth: 150 },
    { prop: 'contract', minWidth: 150, maxWidth: 200 },
    { prop: 'statusCode', minWidth: 150, maxWidth: 200, dictCode: UserDictionariesService.DICTIONARY_VISIT_STATUS },
    { prop: 'debtAmount', minWidth: 150, maxWidth: 200 },
    { prop: 'currencyName', minWidth: 150 },
  ].map(addGridLabel('widgets.address.dialogs.mark'));

  debts: IDebt[];
  selection: IDebt[];

  controls = [
    { controlName: 'purposeCode', type: 'select', dictCode: UserDictionariesService.DICTIONARY_VISIT_STATUS },
    { controlName: 'comment', type: 'textarea' },
  ].map(control => ({ ...control, label: labelKey(control.controlName) })) as IDynamicFormItem[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private markService: MarkService,
  ) {}

  ngOnInit(): void {
    this.markService.fetchDebtsForPerson(this.personId, this.personRole, this.debtorId, this.callCenter)
      .subscribe(debts => {
        this.debts = debts;
        if (debts.length === 1) {
          this.selection = debts;
        }
        this.cdRef.markForCheck();
      });
  }

  get canSubmit(): boolean {
    return !isEmpty(this.selection);
  }

  onSelect(selection: IDebt[]): void {
    this.selection = selection;
    this.cdRef.markForCheck();
  }

  onSubmit(): void {
    const data = {
      ...this.form.serializedUpdates,
      debtIds: this.selection.map(debt => debt.id),
      personRole: this.personRole,
    };
    this.submit.emit(data);
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
