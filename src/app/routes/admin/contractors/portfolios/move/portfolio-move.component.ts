import { Component, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { IContractor, IPortfolio } from '../../contractors-and-portfolios.interface';
import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';

import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-portfolio-move',
  templateUrl: './portfolio-move.component.html'
})
export class PortfolioMoveComponent implements OnDestroy {
  @Input() contractor: IContractor;
  @Input() portfolio: IPortfolio;
  @Output() onSubmit = new EventEmitter<IContractor>();
  @Output() onCancel = new EventEmitter<void>();

  columns: Array<IGridColumn> = [
    { prop: 'name' },
    { prop: 'fullName' },
    { prop: 'responsibleName' },
    { prop: 'typeCode' }
  ];

  private renderers: IRenderer = {
    typeCode: []
  };

  private selectedContractor: IContractor;

  private dictionariesSubscription: Subscription;

  constructor(
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private gridService: GridService,
    private userDictionariesService: UserDictionariesService,
  ) {
    this.dictionariesSubscription = this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE)
      .subscribe(options => {
        this.renderers.typeCode = [].concat(options);
        this.columns = this.gridService.setRenderers(this.columns, this.renderers);
      });

    this.userDictionariesService.preload([ UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE ]);
  }

  ngOnDestroy(): void {
    this.dictionariesSubscription.unsubscribe();
  }

  get canSubmit(): boolean {
    return !!this.selectedContractor;
  }

  get contractors$(): Observable<Array<IContractor>> {
    return this.contractorsAndPortfoliosService.contractors$
      .map(contractors => contractors.filter(contractor => contractor.id !== this.contractor.id));
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
