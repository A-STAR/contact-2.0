import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { first } from 'rxjs/operators';

import { ICloseAction, IGridActionParams } from '../../../../../components/action-grid/action-grid.interface';
import { IGridColumn } from '../../../../../components/grid/grid.interface';
import { ILookupPortfolio } from '../../../../../../core/lookup/lookup.interface';

import { AttributesService } from '../attributes.service';
import { GridService } from '../../../../../components/grid/grid.service';

@Component({
  selector: 'app-mass-attr-portfolio',
  templateUrl: './portfolio.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent implements OnInit {
  @Input() actionData: IGridActionParams;
  @Output() close = new EventEmitter<ICloseAction>();

  selectedPortfolio: ILookupPortfolio;

  columns: IGridColumn[] = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'contractor' },
  ];

  portfolios: ILookupPortfolio[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
    private gridService: GridService
  ) { }

  ngOnInit(): void {

    this.gridService.setAllRenderers(this.columns)
      .pipe(first())
      .subscribe(columns => {
        this.columns = [...columns];
      });

    this.attributesService.getPortfolios()
      .subscribe(portfolios => {
        this.portfolios = portfolios;
        this.cdRef.markForCheck();
      });
  }

  submit(): void {
    this.attributesService
      .change(this.actionData.payload, { portfolioId: this.selectedPortfolio.id })
      .subscribe((res) => {
        const refresh = res.massInfo && !!res.massInfo.processed;
        this.close.emit({ refresh });
      });
  }

  get canSubmit(): boolean {
    return !!this.selectedPortfolio;
  }

  onSelect(portfolio: ILookupPortfolio): void {
    this.selectedPortfolio = portfolio;
  }

  cancel(): void {
    this.close.emit();
  }

}
