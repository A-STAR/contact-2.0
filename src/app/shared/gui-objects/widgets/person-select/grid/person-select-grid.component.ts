import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IAGridResponse } from '../../../../../shared/components/grid2/grid2.interface';
import { IPerson, PersonSelectorComponent, ISelectedPerson } from '../person-select.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { PersonSelectService } from '../person-select.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';


import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { Grid2Component } from '../../../../../shared/components/grid2/grid2.component';

import { isEmpty, makeKey, range, addLabelForEntity } from '../../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.contactGrid.tabs.add.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-select-grid',
  templateUrl: './person-select-grid.component.html',
})
export class PersonSelectGridComponent implements PersonSelectorComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(Grid2Component) grid: Grid2Component;

  controls = [
    { controlName: 'linkTypeCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ].map(control => ({ ...control, label: labelKey(control.controlName) } as IDynamicFormControl));

  columns$ = this.gridService.getColumns([
    { dataType: 1, name: 'id' },
    { dataType: 3, name: 'lastName' },
    { dataType: 3, name: 'firstName' },
    { dataType: 3, name: 'middleName' },
    { dataType: 6, dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, name: 'typeCode' },
    { dataType: 2, name: 'birthDate' },
    { dataType: 6, dictCode: UserDictionariesService.DICTIONARY_GENDER, name: 'genderCode' },
    { dataType: 3, name: 'passportNumber' },
    ...range(1, 10).map(i => ({ dataType: 3, name: `stringValue${i}` })),
  ].map(addLabelForEntity('person')), {});

  rows: IPerson[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  constructor(
    private cdRef: ChangeDetectorRef,
    private personSearchService: PersonSelectService,
    private gridService: GridService,
  ) {}

  get isValid(): boolean {
    return !isEmpty(this.grid && this.grid.selected);
  }

  get person(): Observable<ISelectedPerson> {
    return of({
      ...this.form.serializedValue,
      ...this.selectedPerson,
    });
  }

  onSelect(): void {
    this.cdRef.markForCheck();
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.personSearchService
      .fetchAll(filters, params)
      .subscribe((response: IAGridResponse<IPerson>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }

  private get selectedPerson(): IPerson {
    return this.grid && this.grid.selected && this.grid.selected[0] as any;
  }
}
