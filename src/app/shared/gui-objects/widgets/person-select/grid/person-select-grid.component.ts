import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IAGridResponse } from '../../../../../shared/components/grid2/grid2.interface';
import { IPerson, ISelectedPerson } from '../person-select.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IToolbarItem, ToolbarItemTypeEnum } from 'app/shared/components/toolbar-2/toolbar-2.interface';

import { PersonSelectService } from '../person-select.service';
import { GridService } from '../../../../../shared/components/grid/grid.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';


import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';
import { Grid2Component } from '../../../../../shared/components/grid2/grid2.component';

import { isEmpty, makeKey, range, addLabelForEntity } from '../../../../../core/utils';
import { DialogFunctions } from 'app/core/dialog';

const labelKey = makeKey('modules.contactRegistration.contactGrid.tabs.add.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-select-grid',
  templateUrl: './person-select-grid.component.html',
})
export class PersonSelectGridComponent extends DialogFunctions {

  @Output() select = new EventEmitter<ISelectedPerson>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  @ViewChild(Grid2Component) grid: Grid2Component;

  dialog;

  toolbarItems: Array<IToolbarItem> = [
    {
      type: ToolbarItemTypeEnum.BUTTON_ADD,
      action: () => this.setDialog('create')
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REFRESH,
      action: () => this.fetch()
    }
  ];

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
    private personSelectService: PersonSelectService,
    private gridService: GridService,
  ) {
    super();
  }

  get isValid(): boolean {
    return !isEmpty(this.grid && this.grid.selected);
  }

  get selectedPerson(): ISelectedPerson {
    return {
      ...this.form.serializedValue,
      ...this.gridSelectedPerson,
    };
  }

  onSelect(): void {
    this.select.emit(this.selectedPerson);
  }

  onRequest(): void {
    this.fetch();
  }

  onPersonCreated(person: ISelectedPerson): void {
    this.closeDialog();
    this.fetch()
      .map(rows => rows.findIndex(row => row.id === person.id))
      .subscribe(rowIndex => this.selectPerson(rowIndex));
  }

  private selectPerson(index: number): void {
    this.grid.gridOptions.api.selectIndex(index, false, false);
    this.select.emit(this.selectedPerson);
  }

  private get gridSelectedPerson(): IPerson {
    return this.grid && this.grid.selected && this.grid.selected[0] as any;
  }

  private fetch(): Observable<IPerson[]> {
    const filters = this.grid.getFilters();
    const params = this.grid.getRequestParams();
    const action = this.personSelectService.fetchAll(filters, params);

    action.subscribe((response: IAGridResponse<IPerson>) => {
      this.rows = [ ...response.data ];
      this.rowCount = response.total;
      this.cdRef.markForCheck();
    });

    return action.map(response => response.data);
  }
}
