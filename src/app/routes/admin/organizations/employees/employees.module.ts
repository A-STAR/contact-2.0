import { NgModule } from '@angular/core';

import { SharedModule } from '@app/shared/shared.module';

import { EmployeesComponent } from './employees.component';
import { EmployeeAddComponent } from './add/employee-add.component';
import { EmployeeEditComponent } from './edit/employee-edit.component';

@NgModule({
  imports: [
    SharedModule
  ],
  exports: [
    EmployeesComponent
  ],
  declarations: [
    EmployeesComponent,
    EmployeeAddComponent,
    EmployeeEditComponent,
  ]
})
export class OrganizationsEmployeesModule {
}
