import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { EmployeesComponent } from './employees.component';
import { EmployeeEditComponent } from './employee-edit/employee-edit.component';

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
  ]
})
export class OrganizationsEmployeesModule {
}
