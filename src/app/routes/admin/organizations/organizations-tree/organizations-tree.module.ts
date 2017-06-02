import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { SharedModule } from '../../../../shared/shared.module';

import { OrganizationsEffects } from './organizations.effects';
import { OrganizationsService } from './organizations.service';

import { OrganizationEditComponent } from './organization-edit/organization-edit.component';
import { OrganizationsTreeComponent } from './organizations-tree.component';

@NgModule({
    imports: [
      SharedModule,
      EffectsModule.run(OrganizationsEffects),
    ],
    exports: [
      OrganizationsTreeComponent,
    ],
    declarations: [
      OrganizationsTreeComponent,
      OrganizationEditComponent,
    ],
    providers: [
      OrganizationsService,
    ],
})
export class OrganizationsTreeModule { }
