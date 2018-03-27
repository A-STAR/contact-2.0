import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { IAGridResponse } from '@app/shared/components/grid2/grid2.interface';
import { IContactPerson } from '../contact-select.interface';
import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';

import { ContactSelectService } from '../contact-select.service';
import { GridService } from '@app/shared/components/grid/grid.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';


import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { Grid2Component } from '@app/shared/components/grid2/grid2.component';

import { makeKey, range, addLabelForEntity } from '@app/core/utils';

import { isNil } from 'ramda';

const labelKey = makeKey('routes.workplaces.shared.contactRegistration.contactGrid.tabs.add.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-contact-registration-contact-select-search',
  templateUrl: 'contact-select-search.component.html',
})
export class ContactSelectSearchComponent {
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(Grid2Component) grid: Grid2Component;

  private selectedPersonId: number;

  controls = [
    { controlName: 'linkTypeCode', type: 'select', dictCode: UserDictionariesService.DICTIONARY_CONTACT_PERSON_TYPE },
  ].map(control => ({ ...control, label: labelKey(control.controlName) } as IDynamicFormControl));

  columns$ = this.gridService.getColumns([
    { dataType: 1, name: 'id' },
    { dataType: 3, name: 'personFullName' },
    { dataType: 6, dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE, name: 'typeCode' },
    { dataType: 2, name: 'birthDate' },
    { dataType: 6, dictCode: UserDictionariesService.DICTIONARY_GENDER, name: 'genderCode' },
    { dataType: 3, name: 'passportNumber' },
    ...range(1, 10).map(i => ({ dataType: 3, name: `stringValue${i}` })),
  ].map(addLabelForEntity('contactPerson')), {});

  rows: IContactPerson[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactSelectService: ContactSelectService,
    private gridService: GridService,
  ) {}

  get isValid(): boolean {
    return !isNil(this.selectedPersonId);
  }

  get person(): IContactPerson {
    return {
      ...this.form.serializedValue,
      personId: this.selectedPersonId,
    };
  }

  onSelect(persons: number[]): void {
    this.selectedPersonId = persons[0];
  }

  onRequest(): void {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    this.contactSelectService
      .fetchAllPersons(filters, params)
      .subscribe((response: IAGridResponse<IContactPerson>) => {
        this.rows = [ ...response.data ];
        this.rowCount = response.total;
        this.cdRef.markForCheck();
      });
  }
}
