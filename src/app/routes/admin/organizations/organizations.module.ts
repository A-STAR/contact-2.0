import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../shared/shared.module';
import { OrganizationsTreeModule } from './organizations-tree/organizations-tree.module';
import { OrganizationsEmployeesModule } from './employees/employees.module';

import { OrganizationsEffects } from './organizations.effects';
import { OrganizationsService } from './organizations.service';

import { OrganizationsComponent } from './organizations.component';

const routes: Routes = [
    { path: '', component: OrganizationsComponent },
];

@NgModule({
    imports: [
      SharedModule,
      RouterModule.forChild(routes),
      OrganizationsTreeModule,
      OrganizationsEmployeesModule,
      EffectsModule.forFeature([OrganizationsEffects]),
    ],
    exports: [
      RouterModule,
    ],
    declarations: [
      OrganizationsComponent,
    ],
    providers: [
      OrganizationsService,
    ]
})
export class OrganizationsModule { }
