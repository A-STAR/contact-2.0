import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { IContractor, IPortfolio } from '../../contractors-and-portfolios.interface';
import { IGridColumn } from '../../../../../shared/components/grid/grid.interface';

import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-portfolio-move',
  templateUrl: './portfolio-move.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioMoveComponent implements OnDestroy {

  haveContractor$ = new BehaviorSubject<IContractor>(null);
  havePortfolio$ = new BehaviorSubject<IPortfolio>(null);

  @Input() set contractor(val: IContractor) {
    this._contractor = val;
    if (val) {
      this.haveContractor$.next(val);
    }
  }

  get contractor(): IContractor {
    return this._contractor;
  }

  @Input() set portfolio(val: IPortfolio) {
    this._portfolio = val;
    if (val) {
      this.havePortfolio$.next(val);
    }
  }

  get portfolio(): IPortfolio{
    return this._portfolio;
  }

  @Output() onSubmit = new EventEmitter<IContractor>();
  @Output() onCancel = new EventEmitter<void>();


  columns: Array<IGridColumn> = [
    { prop: 'name' },
    { prop: 'fullName' },
    { prop: 'responsibleName' },
    { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE }
  ];

  contractors: IContractor[];

  private _contractor: IContractor;
  private _portfolio: IPortfolio;

  private selectedContractor: IContractor;

  constructor(
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService,
  ) {

    this.gridService.setAllRenderers(this.columns)
      .subscribe(columns => {
        this.columns = [...columns];
      });

    combineLatest(this.haveContractor$, this.havePortfolio$)
      .filter(([contractor, portfolio]) => !!(contractor && portfolio))
      .pipe(first())
      .flatMap(([contractor, portfolio]) => {
        return this.contractorsAndPortfoliosService.readAllContractorsExeptCurrent(contractor.id);
      })
      .subscribe(contractors => {
        this.contractors = contractors as IContractor[];
        this.cdRef.markForCheck();
      });
  }

  ngOnDestroy(): void {
    // this.dictionariesSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return !!this.selectedContractor;
  }

  onSelect(contractor: IContractor): void {
    this.selectedContractor = contractor;
  }

  submit(): void {
    this.onSubmit.emit(this.selectedContractor);
  }

  cancel(): void {
    this.onCancel.emit();
  }
}
