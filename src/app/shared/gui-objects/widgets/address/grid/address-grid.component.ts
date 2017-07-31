import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { IAddress } from '../address.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { AddressGridService } from './address-grid.service';

@Component({
  selector: 'app-address-grid',
  templateUrl: './address-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddressGridComponent implements OnInit {
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
    }
  ];

  columns: Array<IGridColumn> = [
    { prop: 'typeCode' },
    { prop: 'fullAddress' },
    { prop: 'statusCode' },
    { prop: 'isResidence' },
    { prop: 'isBlocked' },
    { prop: 'blockReasonCode' },
    { prop: 'blockDateTime' },
    { prop: 'comment' },
  ];

  private _addresses: Array<IAddress>;
  private _key: string;

  constructor(
    private addressGridService: AddressGridService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private injector: Injector,
  ) {
    this._key = this.injector.get('key');
  }

  ngOnInit(): void {
    // TODO(d.maltsev): pass entityTypeId id
    const parentId = Number((this.route.params as any).value.id) || null;
    this.addressGridService.fetch(1, parentId)
      .subscribe(addresses => {
        this._addresses = addresses;
        this.cdRef.markForCheck();
      });
  }

  get addresses(): Array<IAddress> {
    return this._addresses;
  }

  onDoubleClick(event: any): void {
    //
  }

  onSelect(event: any): void {
    //
  }
}
