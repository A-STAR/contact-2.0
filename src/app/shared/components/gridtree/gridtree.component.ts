import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/auditTime';

@Component({
  selector: 'app-gridtree',
  templateUrl: './gridtree.component.html',
  styleUrls: [ './gridtree.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridTreeComponent implements OnInit {
  @ViewChild('rowsContainer') rowsContainer: ElementRef;

  rows = Array(1000).fill(null).map((_, i) => `Item #${i}`);

  private rowHeight = 24;
  private iTop = 0;
  private iBottom = Infinity;

  constructor(private cdRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    const rowsContainerElement = this.rowsContainer.nativeElement;
    Observable
      .fromEvent(rowsContainerElement, 'scroll')
      .auditTime(100)
      .subscribe((event: MouseEvent) => {
        const top = rowsContainerElement.scrollTop;
        this.iTop = top / this.rowHeight;
        this.iBottom = (top + rowsContainerElement.offsetHeight) / this.rowHeight;
        this.cdRef.markForCheck();
      });
  }

  getStyle(i: number): any {
    const isWithinViewport = i >= this.iTop && i <= this.iBottom;
    return {
      top: `${this.rowHeight * i}px`,
      background: isWithinViewport ? '#fff' : '#f00'
    }
  }
}
