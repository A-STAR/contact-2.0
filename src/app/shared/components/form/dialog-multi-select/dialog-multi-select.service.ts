import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDialogMultiSelectFilterType, IDialogMultiSelectValue } from './dialog-multi-select.interface';
import { IGridColumn } from '../../grid/grid.interface';

import { GridFiltersService } from '@app/core/filters/grid-filters.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';
import { addGridLabel } from '@app/core/utils';

@Injectable()
export class DialogMultiSelectService {
  private config = {
    portfolios: {
      columnsFrom: [
        { prop: 'id', maxWidth: 70 },
        { prop: 'name' },
        { prop: 'contractorName' },
        { prop: 'statusCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STATUS },
        { prop: 'stageCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_STAGE },
        { prop: 'directionCode', dictCode: UserDictionariesService.DICTIONARY_PORTFOLIO_DIRECTION },
        { prop: 'signDate' },
        { prop: 'startWorkDate', renderer: 'dateTimeRenderer' },
        { prop: 'endWorkDate', renderer: 'dateTimeRenderer' },
      ].map(addGridLabel('default.filters.portfolios.grid')),
      columnsTo: [
        { prop: 'name' },
      ].map(addGridLabel('default.filters.portfolios.grid')),
      fetchCallback: ({ directionCodes }) => this.gridFiltersService.fetchPortfolios(null, directionCodes),
      labelGetter: row => row.name,
      title: 'default.filters.portfolios.title',
      valueGetter: row => row.id,
    },
    users: {
      columnsFrom: [
        { prop: 'id', maxWidth: 70 },
        { prop: 'fullName' },
        { prop: 'organization' },
        { prop: 'position' },
      ].map(addGridLabel('default.filters.users.grid')),
      columnsTo: [
        { prop: 'fullName' },
      ].map(addGridLabel('default.filters.users.grid')),
      fetchCallback: () => this.gridFiltersService.fetchUsers(0),
      labelGetter: row => row.fullName,
      title: 'default.filters.users.title',
      valueGetter: row => row.id,
    },
    actions: {
      columnsFrom: [
        { prop: 'code', maxWidth: 70 },
        { prop: 'name' },
      ].map(addGridLabel('default.filters.actions.grid')),
      columnsTo: [
        { prop: 'code', maxWidth: 70 },
        { prop: 'name' },
      ].map(addGridLabel('default.filters.actions.grid')),
      fetchCallback: () => this.gridFiltersService.fetchDictionaries(4),
      labelGetter: row => row.name,
      title: 'default.filters.actions.title',
      valueGetter: row => row.code,
    },
    entityGroups: {
      columnsFrom: [
        { prop: 'id' },
        { prop: 'name' },
      ].map(addGridLabel('default.filters.entityGroups.grid')),
      columnsTo: [
        { prop: 'name' },
      ].map(addGridLabel('default.filters.entityGroups.grid')),
      fetchCallback: ({entityTypeId, isManual}) => this.gridFiltersService.fetchEntitiesGroups(entityTypeId, isManual),
      labelGetter: row => row.name,
      title: 'default.filters.entityGroups.title',
      valueGetter: row => row.id,
    },
    contractors: {
      columnsFrom: [
        { prop: 'id', maxWidth: 70 },
        { prop: 'name' },
        { prop: 'fullName' },
        { prop: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_CONTRACTOR_TYPE },
        { prop: 'comment' },
      ].map(addGridLabel('default.filters.contractors.grid')),
      columnsTo: [
        { prop: 'fullName' },
      ].map(addGridLabel('default.filters.contractors.grid')),
      fetchCallback: () => this.gridFiltersService.fetchContractors(),
      labelGetter: row => row.fullName,
      title: 'default.filters.contractors.title',
      valueGetter: row => row.id,
    },
  };

  constructor(
    private gridFiltersService: GridFiltersService,
  ) {}

  getColumnsFrom(key: IDialogMultiSelectFilterType): IGridColumn[] {
    return this.config[key].columnsFrom;
  }

  getColumnsFromTranslationKey(key: IDialogMultiSelectFilterType): string {
    return this.config[key].columnsFromTranslationKey;
  }

  getColumnsTo(key: IDialogMultiSelectFilterType): IGridColumn[] {
    return this.config[key].columnsTo;
  }

  getColumnsToTranslationKey(key: IDialogMultiSelectFilterType): string {
    return this.config[key].columnsToTranslationKey;
  }

  getFetchCallback(key: IDialogMultiSelectFilterType): (filterParams: any) => Observable<any> {
    return this.config[key].fetchCallback;
  }

  getLabelGetter(key: IDialogMultiSelectFilterType): (row: any) => string {
    return this.config[key].labelGetter;
  }

  getTitle(key: IDialogMultiSelectFilterType): string {
    return this.config[key].title;
  }

  getValueGetter(key: IDialogMultiSelectFilterType): (row: any) => IDialogMultiSelectValue {
    return this.config[key].valueGetter;
  }
}
