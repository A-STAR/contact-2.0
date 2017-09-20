import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployeeUser, IEmployee, IOrganizationsState } from '../../organizations.interface';

import { GridService } from '../../../../../shared/components/grid/grid.service';
import { OrganizationsService } from '../../organizations.service';

import { EntityBaseComponent } from '../../../../../shared/components/entity/base.component';
import { GridComponent } from '../../../../../shared/components/grid/grid.component';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent extends EntityBaseComponent<IEmployeeUser> {
  @Input() employeeRoleOptions: Array<any> = [];
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @ViewChild(GridComponent) addEmployeeGrid: GridComponent;

  private selectedEmployees: Array<IEmployeeUser>;

  columns: Array<IGridColumn> = [
    { prop: 'fullName', minWidth: 200 },
    { prop: 'position' },
    // TODO: display column depending on filter
    { prop: 'isInactive', minWidth: 100 },
  ];

  renderers: IRenderer = {
    isInactive: 'checkboxRenderer',
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

  onSelectEmployees(): void {
    this.selectedEmployees = this.addEmployeeGrid.selected;
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
