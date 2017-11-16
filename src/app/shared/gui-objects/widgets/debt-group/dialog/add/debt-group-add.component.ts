import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, Input } from '@angular/core';

import { IEntityGroup } from '../../../entity-group/entity-group.interface';

import { DebtGroupService } from '../../debt-group.service';

import { DialogFunctions } from '../../../../../../core/dialog';

@Component({
  selector: 'app-debt-group-add',
  templateUrl: './debt-group-add.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DebtGroupAddComponent extends DialogFunctions {

  @Input() debts: number[];

  @Output() close = new EventEmitter<boolean>();

  dialog: string = null;
  count: number;
  successCount: number;

  constructor(
    private cdRef: ChangeDetectorRef,
    private debtGroupService: DebtGroupService
  ) {
    super();
  }

  onSelect(group: IEntityGroup): void {
    this.debtGroupService.addToGroup(this.debts, group)
      .subscribe(result => {
        this.count = result.massInfo.total;
        this.successCount = result.massInfo.processed;
        this.setDialog('addResult');
        this.cdRef.markForCheck();
      });
  }

  onAddResult(): void {
    this.close.emit(true);
  }

  onClose(): void {
    this.close.emit(false);
  }
}
