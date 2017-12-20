import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { IAGridResponse } from 'app/shared/components/grid2/grid2.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';

import { ContactSelectService } from '../contact-select.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

import { IContactPerson } from '../contact-select.interface';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { Grid2Component } from '../../../../../shared/components/grid2/grid2.component';

import { isEmpty, makeKey, range } from '../../../../../core/utils';

const labelKey = makeKey('modules.contactRegistration.contactGrid.tabs.add.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-contact-registration-contact-select-search',
  templateUrl: 'contact-select-search.component.html',
})
export class ContactSelectSearchComponent {
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
    { dataType: 6, name: 'typeCode', dictCode: UserDictionariesService.DICTIONARY_PERSON_TYPE },
    { dataType: 2, name: 'birthDate' },
    { dataType: 6, name: 'genderCode', dictCode: UserDictionariesService.DICTIONARY_GENDER },
    { dataType: 3, name: 'passportNumber' },
    ...range(1, 10).map(i => ({ dataType: 3, name: `stringValue${i}` })),
  ].map(column => ({ ...column, label: column.name })), {});

  rows: IContactPerson[] = [];
  rowCount = 0;
  rowIdKey = 'id';

  constructor(
    private cdRef: ChangeDetectorRef,
    private contactSelectService: ContactSelectService,
    private gridService: GridService,
  ) {}

  get isValid(): boolean {
    return !isEmpty(this.grid && this.grid.selected);
  }

  get person(): IContactPerson {
    return {
      ...this.form.serializedValue,
      personId: this.selectedPerson.id,
    };
  }

  onSelect(): void {
    this.cdRef.markForCheck();
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

  private get selectedPerson(): IContactPerson {
    return this.grid && this.grid.selected && this.grid.selected[0] as any;
  }
}
