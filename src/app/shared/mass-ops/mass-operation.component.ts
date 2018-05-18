import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';

import { IAction, ICloseAction } from './mass-operation.interface';

import { DialogFunctions } from '@app/core/dialog';

@Component({
  selector: 'app-mass-operation',
  templateUrl: './mass-operation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MassOperationComponent extends DialogFunctions {

  @Input()
  set type(type: string) {
    this.dialog = type;
  }

  @Input()
  set actionData(actionData: IAction) {
    this.dialogData = actionData;
  }

  @Output() close = new EventEmitter<ICloseAction>();

  dialog: string;
  dialogData: IAction;

  get isCustomOperation(): boolean {
    return this.dialogData && !!this.dialogData.id;
  }

  onCloseAction(event: ICloseAction): void {
    this.close.emit(event);
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
}
