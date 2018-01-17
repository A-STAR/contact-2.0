import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IAGridResponse, IAGridColumn } from 'app/shared/components/grid2/grid2.interface';
import { IGridColumn } from '../info-debt.interface';

import { GridService } from 'app/shared/components/grid/grid.service';
import { InfoDebtService } from '../info-debt.service';

import { Grid2Component } from 'app/shared/components/grid2/grid2.component';

@Component({
  selector: 'app-info-debt-detail-grid',
  templateUrl: './detail-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailGridComponent implements OnInit, OnDestroy {

  @Input() set gridKey(gridKey: string) {
    this.gridKey$.next(gridKey);
  }

  @Input() columns: IGridColumn[];
  @Input() rowIdKey: string;

  @ViewChild(Grid2Component) grid: Grid2Component;

  columns$: Observable<IAGridColumn[]>;

  rows: any[] = [];
  rowCount = 0;

  private gridKey$ = new BehaviorSubject<string>(null);
  private gridKeySubscription: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private infoDebtService: InfoDebtService,
    private gridService: GridService,
  ) { }

  ngOnInit(): void {
    this.columns$ = this.gridService.getColumns(this.columns, {});

    this.gridKeySubscription = this.gridKey$
      .subscribe(() => this.onRequest());
  }

  ngOnDestroy(): void {
    this.gridKeySubscription.unsubscribe();
  }

  get gridKey(): string {
    return this.gridKey$.value;
  }

  onRequest(): void {
    if (this.gridKey && this.grid) {
      this.fetch();
    } else {
      this.clear();
    }
  }

  private fetch(): void {
    this.infoDebtService
      .fetch(this.gridKey, this.grid.getFilters(), this.grid.getRequestParams())
      .subscribe((response: IAGridResponse<any>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  private clear(): void {
    this.rows = [];
    this.cdRef.markForCheck();
  }
}
