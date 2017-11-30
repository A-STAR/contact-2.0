import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { IEntityAttributes } from 'app/core/entity/attributes/entity-attributes.interface';
import { IFilterGridDef } from './work-task.interface';
import { IFilterControl } from 'app/shared/components/filter-grid/filter-grid.interface';

import { EntityAttributesService } from '../../../core/entity/attributes/entity-attributes.service';
import { UserDictionariesService } from '../../../core/user/dictionaries/user-dictionaries.service';

import { makeKey, range } from '../../../core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-work-task',
  templateUrl: 'work-task.component.html',
})
export class WorkTaskComponent implements OnInit {
  static COMPONENT_NAME = 'WorkTaskComponent';

  grids: IFilterGridDef[] = [
    {
      key: 'contactLogPromise',
      translationKey: 'modules.workTask',
      title: 'modules.workTask.newDebt.title',
      filterDef: [
        'portfolioId', 'dictValue1', 'dictValue2', 'dictValue3',
        'dictValue4', 'regionCode', 'branchCode', 'searchBtn'
      ]
    }
  ];

  constructor(private cdRef: ChangeDetectorRef, private entityAttributesService: EntityAttributesService) {
  }

  ngOnInit(): void {
    this.entityAttributesService.getDictValueAttributes()
      .pipe(first())
      .subscribe(attributes => {
        this.grids.forEach(grid => grid.filterControls = this.createFilterControls(grid, attributes));
        this.cdRef.markForCheck();
      });
  }

  private createFilterControls(gridDef: IFilterGridDef, attributes: IEntityAttributes): IFilterControl[] {
    const labelKey = makeKey(`${gridDef.translationKey}.filters.form`);
    return (<IFilterControl[]>[
      {
        label: labelKey('portfolioId'),
        controlName: 'portfolioId',
        type: 'text',
        filterType: 'portfolios',
        filterParams: { directionCodes: [ 1 ] },
        width: 3
      },
      ...range(1, 4).map(i => ({
        label: labelKey(`dictValue${i}`),
        controlName: `dictValue${i}`,
        type: 'selectwrapper',
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
        display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
        width: 3
      } as IFilterControl)),
      {
        label: labelKey('regionCode'),
        controlName: 'regionCode',
        type: 'selectwrapper',
        dictCode: UserDictionariesService.DICTIONARY_REGIONS,
        width: 3
      },
      {
        label: labelKey('branchCode'),
        controlName: 'branchCode',
        type: 'selectwrapper',
        dictCode: UserDictionariesService.DICTIONARY_BRANCHES,
        width: 3
      },
      {
        label: `default.buttons.search`,
        controlName: 'searchBtn',
        type: 'searchBtn',
        iconCls: 'fa-search',
        width: 3
      }
    ]).filter(control => gridDef.filterDef.find(filterDef => filterDef === control.controlName));
  }
}
