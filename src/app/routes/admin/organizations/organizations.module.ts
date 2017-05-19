import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { OrganizationsService } from './organizations.service';
import { OrganizationsComponent } from './organizations.component';
import { OrganizationsTreeModule } from './organizations-tree/organizations-tree.module';

const routes: Routes = [
    { path: '', component: OrganizationsComponent },
];

@NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild(routes),
      OrganizationsTreeModule,
    ],
    exports: [
      RouterModule,
    ],
    providers: [
      OrganizationsService,
    ],
    declarations: [
      OrganizationsComponent,
    ]
})
export class OrganizationsModule { }
