import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { OrganizationsComponent } from './organizations.component';
import { OrganizationsService } from './organizations.service';

const routes: Routes = [
    { path: '', component: OrganizationsComponent },
];

@NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild(routes),
    ],
    exports: [
      RouterModule,
    ],
    providers: [
      OrganizationsService
    ],
    declarations: [
      OrganizationsComponent,
    ]
})
export class OrganizationsModule { }
