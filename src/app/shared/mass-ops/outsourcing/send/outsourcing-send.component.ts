import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

import { ICloseAction, IGridAction } from '@app/shared/components/action-grid/action-grid.interface';
import { IFilterPortfolio } from '@app/core/filters/grid-filters.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { OutsourcingService } from '../outsourcing.service';

import { DateRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-outsourcing-send',
  templateUrl: './outsourcing-send.component.html',
  styleUrls: ['./outsourcing-send.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OutsourcingSendComponent implements OnInit {

  @Input() actionData: IGridAction;
  @Output() close = new EventEmitter<ICloseAction>();

  selectedPortfolio: IFilterPortfolio;

  columns: ISimpleGridColumn<IFilterPortfolio>[] = [
    { prop: 'id' },
    { prop: 'name' },
    { prop: 'contractorName' },
    { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS },
    { prop: 'stageCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE },
    { prop: 'signDate', renderer: DateRendererComponent },
    { prop: 'startWorkDate', renderer: DateRendererComponent },
    { prop: 'endWorkDate', renderer: DateRendererComponent },
  ].map(addGridLabel('widgets.mass.outsourcing.send.grid'));

  portfolios: IFilterPortfolio[];

  constructor(
    private outsourcingService: OutsourcingService,
    private cdRef: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {

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

  onSelect(portfolios: IFilterPortfolio[]): void {
    this.selectedPortfolio = portfolios[0];
  }

  cancel(): void {
    this.close.emit();
  }

}
