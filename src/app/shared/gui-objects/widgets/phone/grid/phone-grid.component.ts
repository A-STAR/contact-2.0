import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

@Component({
  selector: 'app-phone-grid',
  templateUrl: './phone-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridComponent implements OnInit {
  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_EDIT,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_DELETE,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_SMS,
      enabled: Observable.of(true),
      action: () => {}
    },
    {
      type: ToolbarItemTypeEnum.CHECKBOX,
      label: 'debtor.information.phone.toolbar.verification',
      enabled: Observable.of(true),
      action: () => {}
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'typeCode' },
    { prop: 'phoneNumber' },
    { prop: 'statusCode' },
    { prop: 'isBlocked' },
    { prop: 'blockReasonCode' },
    { prop: 'blockDateTime' },
    { prop: 'comment' },
  ];

  private _phones: Array<any>;
  private _key: string;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private injector: Injector,
  ) {
    this._key = this.injector.get('key');
  }

  ngOnInit(): void {
    // TODO(d.maltsev): pass person id
    this.changeDetectorRef.markForCheck();
  }

  get phones(): Array<any> {
    return this._phones;
  }

  onDoubleClick(event: any): void {
    //
  }

  onSelect(event: any): void {
    //
  }
}
