import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

import { IPortfolio } from '../../contractors-and-portfolios.interface';
import { IDynamicFormItem } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IOption } from '../../../../../core/converter/value/value-converter.interface';

import { ContentTabService } from '../../../../../shared/components/content-tabstrip/tab/content-tab.service';
import { ContractorsAndPortfoliosService } from '../../contractors-and-portfolios.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-portfolio-edit',
  templateUrl: './portfolio-edit.component.html'
})
export class PortfolioEditComponent {
  static COMPONENT_NAME = 'ContractorEditComponent';

  @ViewChild('form') form: DynamicFormComponent;

  controls: Array<IDynamicFormItem> = null;
  formData: IPortfolio = null;

  constructor(
    private actions: Actions,
    private activatedRoute: ActivatedRoute,
    private contentTabService: ContentTabService,
    private contractorsAndPortfoliosService: ContractorsAndPortfoliosService,
    private userDictionariesService: UserDictionariesService,
  ) {
    // TODO(d.maltsev): stronger typing
    const portfolioId = Number((this.activatedRoute.params as any).value.id);
    this.contractorsAndPortfoliosService.fetchPortfolio(portfolioId);

    Observable.combineLatest(
      this.actions.ofType(ContractorsAndPortfoliosService.PORTFOLIOS_FETCH_SUCCESS).map(action => action.payload.portfolio),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE),
      this.userDictionariesService.getDictionaryOptions(UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS)
    )
    // TODO(d.maltsev): handle errors
    .take(1)
    .subscribe(([ portfolio, directionOptions, stageOptions, statusOptions ]) => {
      this.initFormControls(directionOptions, stageOptions, statusOptions);
      // TODO(d.maltsev): convert all dates to Date here and in grid
      this.formData = portfolio;
    });

    this.userDictionariesService.preload([
      UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION,
      UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE,
      UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS,
    ]);
  }

  canSubmit(): boolean {
    return this.form && this.form.canSubmit;
  }

  onSubmit(): void {
    console.log('Submitting...');
    console.log(this.form.data);
  }

  onClose(): void {
    this.contentTabService.navigate('/admin/contractors');
  }

  private initFormControls(directionOptions: Array<IOption>, stageOptions: Array<IOption>, statusOptions: Array<IOption>): void {
    this.controls = [
      { label: 'portfolios.grid.name', controlName: 'name', type: 'text', required: true },
      { label: 'portfolios.grid.directionCode', controlName: 'directionCode', type: 'select', required: true,  disabled: true,
          options: directionOptions },
      { label: 'portfolios.grid.stageCode', controlName: 'stageCode', type: 'select', options: stageOptions },
      { label: 'portfolios.grid.statusCode', controlName: 'statusCode', type: 'select', required: true, options: statusOptions },
      { label: 'portfolios.grid.signDate', controlName: 'signDate', type: 'text' },
      { label: 'portfolios.grid.startWorkDate', controlName: 'startWorkDate', type: 'text' },
      { label: 'portfolios.grid.endWorkDate', controlName: 'endWorkDate', type: 'text' },
      { label: 'portfolios.grid.comment', controlName: 'comment', type: 'textarea' },
    ];
  }
}
