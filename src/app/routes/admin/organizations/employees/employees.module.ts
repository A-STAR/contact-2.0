import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { EmployeesService } from './employees.service';
import { EmployeesComponent } from './employees.component';
import { EmployeeAddComponent } from './employee-add/employee-add.component';
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
    EmployeeAddComponent,
    EmployeeEditComponent,
  ],
  providers: [
    EmployeesService,
  ],
})
export class OrganizationsEmployeesModule {
}
