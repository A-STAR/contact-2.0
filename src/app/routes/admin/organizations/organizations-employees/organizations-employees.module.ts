import { NgModule } from '@angular/core';
import { SharedModule } from '../../../../shared/shared.module';
import { OrganizationsEmployeesComponent } from './organizations-employees.component';

@NgModule({
    imports: [
      SharedModule,
    ],
    exports: [
      OrganizationsEmployeesComponent
    ],
    declarations: [
      OrganizationsEmployeesComponent,
    ]
})
export class OrganizationsEmployeesModule { }
