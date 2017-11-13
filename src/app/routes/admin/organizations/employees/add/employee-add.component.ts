import { Component, EventEmitter, Input, Output, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IGridColumn, IRenderer } from '../../../../../shared/components/grid/grid.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployeeUser, IEmployee, IOrganizationsState } from '../../organizations.interface';

import { GridService } from '../../../../../shared/components/grid/grid.service';
import { OrganizationsService } from '../../organizations.service';

import { EntityBaseComponent } from '../../../../../shared/components/entity/base.component';
import { GridComponent } from '../../../../../shared/components/grid/grid.component';
import { Subscription } from 'rxjs/Subscription';
import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent implements OnInit {
  @Input() employeeRoleOptions: Array<any> = [];
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @ViewChild(GridComponent) addEmployeeGrid: GridComponent;
  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private selectedEmployees: Array<IEmployeeUser>;
  private employeesSub: Subscription;
  notAddedEmployees: Observable<IEmployee[]>;
  controls: Array<IDynamicFormControl> = [
    {
      label: 'users.edit.role',
      controlName: 'roleCode',
      type: 'select',
      required: true,
      options: this.employeeRoleOptions
    },
  ];

  columns: Array<IGridColumn> = [
    { prop: 'fullName', minWidth: 200 },
    { prop: 'position' },
    // TODO: display column depending on filter
    { prop: 'isInactive', minWidth: 100, renderer: 'checkboxRenderer' },
  ];

  get formData(): any {
    return {
      roleCode: [
        this.employeeRoleOptions[0]
      ]
    };
  }

  constructor(
    private gridService: GridService,
    private organizationsService: OrganizationsService,
  ) { }

  get state(): Observable<IOrganizationsState> {
    return this.organizationsService.state;
  }

  ngOnInit(): void {
    this.notAddedEmployees = this.organizationsService.fetchNotAddedEmployees();
    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => this.columns = [...columns]);
  }

  onSelectEmployees(): void {
    this.selectedEmployees = this.addEmployeeGrid.selected;
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
