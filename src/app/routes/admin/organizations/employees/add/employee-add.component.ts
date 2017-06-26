import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

import { IDataSource, IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { IEmployeeUser, IEmployee, IOrganizationsState } from '../../organizations.interface';

import { GridService } from '../../../../../shared/components/grid/grid.service';
import { OrganizationsService } from '../../organizations.service';
import { ValueConverterService } from '../../../../../core/converter/value/value-converter.service';

import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent extends EntityBaseComponent<IEmployeeUser> {
  @Input() employeeRoleOptions: Array<any> = [];
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();

  private selectedEmployees: Array<IEmployeeUser>;

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

  get formData(): any {
    return {
      roleCode: [
        this.employeeRoleOptions[0]
      ]
    };
  };

  constructor(
    private gridService: GridService,
    private organizationsService: OrganizationsService,
    private translateService: TranslateService,
    private valueConverterService: ValueConverterService,
  ) {
    super();
    this.organizationsService.fetchNotAddedEmployees();
    this.columns = this.gridService.setRenderers(this.columns, this.renderers);
  }

  get state(): Observable<IOrganizationsState> {
    return this.organizationsService.state;
  }

  toSubmittedValues(values: IEmployeeUser): any {
    return {
      roleCode: this.dynamicForm.value.roleCode[0].value,
      usersIds: this.selectedEmployees.map((employee: IEmployee) => employee.userId)
    };
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
        options: this.employeeRoleOptions
      },
    ];
  }
}
