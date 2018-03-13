import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { ILookupPortfolio } from '@app/core/lookup/lookup.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { AttributesService } from '../attributes.service';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-mass-attr-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent implements OnInit {
  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  selectedPortfolio: ILookupPortfolio;

  columns: ISimpleGridColumn<ILookupPortfolio>[] = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'contractor' },
  ].map(addGridLabel('widgets.mass.changePortfolioAttr.grid'));

  portfolios: ILookupPortfolio[];

  constructor(
    private attributesService: AttributesService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

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

  onSelect(portfolios: ILookupPortfolio[]): void {
    this.selectedPortfolio = portfolios[0];
  }

  cancel(): void {
    this.close.emit();
  }

}
