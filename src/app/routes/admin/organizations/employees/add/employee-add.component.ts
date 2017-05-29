import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { IDataSource, IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IEmployeeUser, IEmployee, IEmployeesResponse, IOrganization } from '../../organizations.interface';

import { GridService } from '../../../../../shared/components/grid/grid.service';
import { ValueConverterService } from '../../../../../core/converter/value/value-converter.service';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { GridComponent } from '../../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent extends EntityBaseComponent<IEmployeeUser> implements AfterViewInit {
  @Input() masterEntity: IOrganization;
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @ViewChild('addEmplpoyeeGrid') addEmplpoyeeGrid: GridComponent;

  private selectedEmployees: Array<IEmployeeUser>;

  // TODO: dictionary service
  private options = [
    { value: 1, label: 'Сотрудник' },
    { value: 2, label: 'Руководитель' },
    { value: 3, label: 'Заместитель' },
    { value: 4, label: 'Куратор' },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'fullName', minWidth: 200 },
    { prop: 'position' },
    // TODO: display column depending on filter
    { prop: 'isBlocked', minWidth: 100 },
  ];

  renderers: IRenderer = {
    fullName: (employee: IEmployeeUser) => `${employee.lastName || ''} ${employee.firstName || ''} ${employee.middleName || ''}`,
    isBlocked: ({ isBlocked }) => this.translateService.instant(isBlocked ? 'default.yesNo.Yes' : 'default.yesNo.No'),
  };

  dataSource: IDataSource = {
    read: '/api/organizations/{id}/users/notadded',
    dataKey: 'users'
  };

  formData = {
    roleCode: [
      this.options[0]
    ]
  };

  constructor(
    private gridService: GridService,
    private valueConverterService: ValueConverterService,
    private translateService: TranslateService
  ) {
    super();
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  parseFn = (data: IEmployeesResponse) => data.users;

  toSubmittedValues(values: IEmployeeUser): any {
    return {
      roleCode: this.dynamicForm.value.roleCode[0].id,
      usersIds: this.selectedEmployees.map((employee: IEmployee) => employee.userId)
    };
  }

  ngAfterViewInit(): void {
    this.addEmplpoyeeGrid.load({ id: this.masterEntity.id }).subscribe();
  }

  onSelectEmployees(employees: Array<IEmployeeUser>): void {
    this.selectedEmployees = employees;
  }

  canSubmit(): boolean {
    return this.selectedEmployees && this.selectedEmployees.length > 0;
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'users.edit.role',
        controlName: 'roleCode',
        type: 'select',
        required: true,
        options: this.options
      },
    ];
  }
}
