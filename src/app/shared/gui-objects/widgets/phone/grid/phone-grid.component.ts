import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-phone-grid',
  templateUrl: './phone-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhoneGridComponent implements OnInit {
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
