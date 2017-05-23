import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ValueConverterService } from '../../../../../core/converter/value/value-converter.service';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form-control.interface';
import { GridColumnDecoratorService } from '../../../../../shared/components/grid/grid.column.decorator.service';
import { GridComponent } from '../../../../../shared/components/grid/grid.component';
import { IDataSource } from '../../../../../shared/components/grid/grid.interface';
import { EntityBaseComponent } from '../../../../../shared/components/entity/edit/entity.base.component';
import { IEmployee, IEmployeesResponse, IOrganization } from '../../organizations.interface';

@Component({
  selector: 'app-employee-add',
  templateUrl: './employee-add.component.html'
})
export class EmployeeAddComponent extends EntityBaseComponent<IEmployee> implements AfterViewInit {
  @Input() masterEntity: IOrganization;
  @Output() submit: EventEmitter<any> = new EventEmitter();
  @Output() cancel: EventEmitter<null> = new EventEmitter<null>();
  @ViewChild('addEmplpoyeeGrid') addEmplpoyeeGrid: GridComponent;

  private selectedEmployees: Array<IEmployee>;

  columns: Array<any> = [
    this.columnDecoratorService.decorateColumn(
      { prop: 'fullName', minWidth: 200 },
      (employee: IEmployee) => `${employee.lastName || ''} ${employee.firstName || ''} ${employee.middleName || ''}`
    ),
    { prop: 'position' },
    this.columnDecoratorService.decorateColumn(
      // TODO: display column depending on filter
      { prop: 'isBlocked', minWidth: 100 },
      ({ isBlocked }) => this.translateService.instant(isBlocked ? 'default.yesNo.Yes' : 'default.yesNo.No')
    ),
  ];

  dataSource: IDataSource = {
    read: '/api/organizations/{id}/users/notadded',
    dataKey: 'users'
  };

  formData = {
    roleCode: 1
  };

  constructor(
    private columnDecoratorService: GridColumnDecoratorService,
    private valueConverterService: ValueConverterService,
    private translateService: TranslateService
  ) {
    super();
  }

  parseFn = (data: IEmployeesResponse) => data.users;

  onSubmit(): void {
    this.submit.emit({
      roleCode: this.form.value.roleCode[0].id,
      userIds: this.selectedEmployees.map((employee: IEmployee) => employee.userId)
    });
  }

  ngAfterViewInit(): void {
    this.addEmplpoyeeGrid.load({ id: this.masterEntity.id }).subscribe();
  }

  onSelectEmployees(employees: Array<IEmployee>): void {
    this.selectedEmployees = employees;
  }

  canSubmit(): boolean {
    return this.selectedEmployees && this.selectedEmployees.length > 0 && this.form.canSubmit;
  }

  protected getControls(): Array<IDynamicFormControl> {
    return [
      {
        label: 'users.edit.role',
        controlName: 'roleCode',
        type: 'select',
        required: true,
        // TODO: dictionary service
        options: [
          { value: 1, label: 'Сотрудник' },
          { value: 2, label: 'Руководитель' },
          { value: 3, label: 'Заместитель' },
          { value: 4, label: 'Куратор' },
        ]
      },
    ];
  }
}
