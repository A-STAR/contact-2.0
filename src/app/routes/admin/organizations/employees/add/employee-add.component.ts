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

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent extends EntityBaseComponent<IEmployeeUser> implements OnInit {
  @Input() employeeRoleOptions: Array<any> = [];
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @ViewChild(GridComponent) addEmployeeGrid: GridComponent;

  private selectedEmployees: Array<IEmployeeUser>;
  private employeesSub: Subscription;
  public notAddedEmployees: Observable<IEmployee[]>;

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
  ) {
    super();
    // base class form render fails if this loc placed inside ngOnInit
  }

  get state(): Observable<IOrganizationsState> {
    return this.organizationsService.state;
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.notAddedEmployees = this.organizationsService.fetchNotAddedEmployees();
    this.gridService.setAllRenderers(this.columns)
      .take(1)
      .subscribe(columns => this.columns = [...columns]);
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
