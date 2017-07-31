import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';

import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

@Component({
  selector: 'app-email-grid',
  templateUrl: './email-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmailGridComponent implements OnInit {
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

  private _emails: Array<any>;
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

  get emails(): Array<any> {
    return this._emails;
  }

  onDoubleClick(event: any): void {
    //
  }

  onSelect(event: any): void {
    //
  }
}
