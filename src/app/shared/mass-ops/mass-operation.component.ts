import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { IAction, ICloseAction } from './mass-operation.interface';

import { ActionGridService } from '@app/shared/components/action-grid/action-grid.service';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-mass-operation',
  templateUrl: './mass-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MassOperationComponent extends DialogFunctions {

  @Input()
  set type(type: string) {
    this._type = type;
  }

  get type(): string {
    return this._type;
  }

  @Input()
  set actionData(actionData: IAction) {
    if (actionData) {
      this.onOperation(actionData);
    }
    this.dialogData = actionData;
  }

  @Output() close = new EventEmitter<ICloseAction>();

  dialog: string;
  dialogData: IAction;
  confirmParams: { count: number, total: number };

  private _type: string;

  constructor(
    private actionGridService: ActionGridService,
    private cdRef: ChangeDetectorRef,
  ) {
    super();
  }

  get isCustomOperation(): boolean {
    return this.dialogData && !!this.dialogData.id;
  }

  onCloseAction(event: ICloseAction): void {
    this.close.emit(event);
    this._type = null;
    this.setDialog();
  }

  isAttrChangeDictionaryDlg(): boolean {
    return [
      'changeRegionAttr',
      'changeDict1Attr',
      'changeDict2Attr',
      'changeDict3Attr',
      'changeDict4Attr',
      'changeCreditTypeAttr',
      'changeBranchAttr'
    ].includes(this.dialog);
  }

  onConfirm(name: string): void {
    this.setDialog(name);
  }

  private onOperation(data: IAction): void {
    const count = this.actionGridService.getSelectionCount(data.payload) || 0;
    const total = (data.selection && data.selection.length) || 0;

    if ((count < total) && !this.actionGridService.isFilterAction(data.payload)) {
      this.confirmParams = { count: total - count, total };
      this.setDialog('confirm');
    } else {
      this.setDialog(this._type);
    }

    this.cdRef.markForCheck();
  }
}
