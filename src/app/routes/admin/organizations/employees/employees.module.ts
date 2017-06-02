import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared/shared.module';

import { EmployeesEffects } from './employees.effects';
import { EmployeesService } from './employees.service';

import { EmployeesComponent } from './employees.component';
import { EmployeeAddComponent } from './add/employee-add.component';
import { EmployeeEditComponent } from './edit/employee-edit.component';

@NgModule({
  imports: [
    SharedModule,
    EffectsModule.run(EmployeesEffects),
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
