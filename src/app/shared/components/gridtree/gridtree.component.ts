import {
  Component,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  ElementRef,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/auditTime';

import { IGridTreeColumn, IGridTreeRow } from './gridtree.interface';

@Component({
  selector: 'app-gridtree',
  templateUrl: './gridtree.component.html',
  styleUrls: [ './gridtree.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeComponent<T> implements OnInit {
  private static THROTTLE_INTERVAL = 100;

  @Input() columns: Array<IGridTreeColumn<T>> = [];
  @Input() height: number;
  @Input() rows: Array<IGridTreeRow<T>> = [];

  @ViewChild('rowsContainer') rowsContainer: ElementRef;

  private rowHeight = 24;
  private iTop = 0;
  private iHeight = 0;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    const rowsContainerElement = this.rowsContainer.nativeElement;
    this.iHeight = this.height / this.rowHeight;
    Observable
      .fromEvent(rowsContainerElement, 'scroll')
      .auditTime(GridTreeComponent.THROTTLE_INTERVAL)
      .subscribe((event: MouseEvent) => {
        const top = rowsContainerElement.scrollTop;
        this.iTop = top / this.rowHeight;
        this.cdRef.markForCheck();
      });
  }

  get iMin(): number {
    return Math.max(0, Math.floor(this.iTop - this.iHeight));
  }

  get iMax(): number {
    return Math.min(this.rows.length, Math.ceil(this.iTop + 2 * this.iHeight));
  }

  get rowsForViewport(): Array<any> {
    return this.rows.slice(this.iMin, this.iMax);
  }

  get totalHeight(): number {
    return this.rowHeight * this.rows.length;
  }

  getStyle(i: number): Object {
    return {
      top: `${this.rowHeight * i}px`
    }
  }

  hasChildren(row: IGridTreeRow<T>): boolean {
    return row.children && row.children.length > 0;
  }
}
