import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { OrganizationsComponent } from './organizations.component';
import { OrganizationsTreeModule } from './organizations-tree/organizations-tree.module';
import { OrganizationsEmployeesModule } from './employees/employees.module';

const routes: Routes = [
    { path: '', component: OrganizationsComponent },
];

@NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild(routes),
      OrganizationsTreeModule,
      OrganizationsEmployeesModule,
    ],
    exports: [
      RouterModule,
    ],
    declarations: [
      OrganizationsComponent,
    ]
})
export class OrganizationsModule { }
