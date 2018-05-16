import { Component, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { take } from 'rxjs/operators';

import { IDynamicFormControl, ISelectItemsPayload } from '@app/shared/components/form/dynamic-form/dynamic-form.interface';
import { IEmployeeUser, IEmployee } from '../../organizations.interface';
import { ISimpleGridColumn } from '@app/shared/components/grids/grid/grid.interface';

import { OrganizationsService } from '../../organizations.service';
import { UserDictionariesService } from '@app/core/user/dictionaries/user-dictionaries.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';
import { TickRendererComponent } from '@app/shared/components/grids/renderers';

import { addGridLabel } from '@app/core/utils';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent implements OnInit {
  @Output() submit = new EventEmitter<any>();
  @Output() cancel = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private selectedEmployees: Array<IEmployeeUser> = [];
  private selectedRole: Boolean;

  notAddedEmployees: Observable<IEmployee[]>;
  controls: Array<IDynamicFormControl> = [];

  columns: ISimpleGridColumn<IEmployee>[] = [
    { prop: 'fullName', minWidth: 200 },
    { prop: 'position' },
    { prop: 'isInactive', minWidth: 100, renderer: TickRendererComponent },
  ].map(addGridLabel('organizations.employees.add.grid'));

  formData: any = {};

  constructor(
    private organizationsService: OrganizationsService,
    private userDictionariesService: UserDictionariesService,
  ) { }

  ngOnInit(): void {
    this.notAddedEmployees = this.organizationsService.fetchNotAddedEmployees();
    this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_EMPLOYEE_ROLE)
      .pipe(
        take(1),
      )
      .subscribe(options => {
        this.controls = [
          {
            label: 'users.edit.role',
            controlName: 'roleCode',
            type: 'select',
            required: true,
            options,
          },
        ];
        this.formData = {
          roleCode: [
            options[0]
          ]
        };
      });
  }

  onSelectEmployees(employees: IEmployeeUser[]): void {
    this.selectedEmployees = employees;
  }

  onSelectRole(payload: ISelectItemsPayload): void {
    this.selectedRole = true;
  }

  canSubmit(): boolean {
    return this.selectedEmployees && this.selectedEmployees.length > 0 &&
    this.selectedRole &&
    this.form && this.form.isValid;
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
