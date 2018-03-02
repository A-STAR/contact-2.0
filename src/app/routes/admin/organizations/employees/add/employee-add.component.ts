import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IDynamicFormControl } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployeeUser, IEmployee, IOrganizationsState } from '../../organizations.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { OrganizationsService } from '../../organizations.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent implements OnInit {
  @Input() employeeRoleOptions: Array<any> = [];
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private selectedEmployees: Array<IEmployeeUser> = [];

  notAddedEmployees: Observable<IEmployee[]>;
  controls: Array<IDynamicFormControl> = [];

  columns: ISimpleGridColumn<IEmployee>[] = [
    { prop: 'fullName', minWidth: 200 },
    { prop: 'position' },
    { prop: 'isInactive', minWidth: 100, renderer: 'checkboxRenderer' },
  ].map(addGridLabel('organizations.employees.add.grid'));

  formData: any = {};

  constructor(
    private organizationsService: OrganizationsService,
  ) { }

  get state(): Observable<IOrganizationsState> {
    return this.organizationsService.state;
  }

  ngOnInit(): void {
    this.notAddedEmployees = this.organizationsService.fetchNotAddedEmployees();
    this.controls = [
      {
        label: 'users.edit.role',
        controlName: 'roleCode',
        type: 'select',
        required: true,
        options: this.employeeRoleOptions
      },
    ];
    this.formData = {
      roleCode: [
        this.employeeRoleOptions[0]
      ]
    };
  }

  onSelectEmployees(employees: IEmployeeUser[]): void {
    this.selectedEmployees = employees;
  }

  canSubmit(): boolean {
    return this.selectedEmployees && this.selectedEmployees.length > 0;
  }

  onSubmit(): void {
    // we must send the roleCode, so explicitly ask for all form values,
    // since user may not touch the roles' dropdown
    const formData = this.form.serializedValue;
    this.submit.emit({ ...formData, usersIds: this.selectedEmployees.map((employee: IEmployee) => employee.userId)});
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
