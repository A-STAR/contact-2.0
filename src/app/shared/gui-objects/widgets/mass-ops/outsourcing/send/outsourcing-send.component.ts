import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { first } from 'rxjs/operators';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IFilterPortfolio } from '@app/core/filters/grid-filters.interface';
import { IGridColumn } from '@app/shared/components/grid/grid.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { OutsourcingService } from '../outsourcing.service';

@Component({
  selector: 'app-outsourcing-send',
  templateUrl: './outsourcing-send.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutsourcingSendComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  selectedPortfolio: IFilterPortfolio;

  columns: IGridColumn[] = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'contractorName' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS },
    { prop: 'stageCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE },
    { prop: 'signDate', renderer: 'dateRenderer' },
    { prop: 'startWorkDate', renderer: 'dateRenderer' },
    { prop: 'endWorkDate', renderer: 'dateRenderer' },
  ];

  portfolios: IFilterPortfolio[];

  constructor(
    private outsourcingService: OutsourcingService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService
  ) { }

  ngOnInit(): void {

    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
      });

    this.outsourcingService
      .getOutsourcingPortfolios()
      .subscribe(portfolios => {
        this.portfolios = portfolios;
        this.cdRef.markForCheck();
      });
  }

  submit(): void {
    this.outsourcingService
      .send(this.actionData.payload, this.selectedPortfolio)
      .subscribe((res) => {
        const refresh = res.massInfo && !!res.massInfo.processed;
        this.close.emit({ refresh });
      });
  }

  get canSubmit(): boolean {
    return !!this.selectedPortfolio;
  }

  onSelect(portfolio: IFilterPortfolio): void {
    this.selectedPortfolio = portfolio;
  }

  cancel(): void {
    this.close.emit();
  }

}
