import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { EmployeesComponent } from './employees.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';
import { EmployeeRemoveComponent } from './employee-remove/employee-remove.component';

@NgModule({
    imports: [
      SharedModule,
    ],
    exports: [
      EmployeesComponent
    ],
    declarations: [
      EmployeesComponent,
      EmployeeEditComponent,
      EmployeeRemoveComponent,
    ]
})
export class OrganizationsEmployeesModule { }
