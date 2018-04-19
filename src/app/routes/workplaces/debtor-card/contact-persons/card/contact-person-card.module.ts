import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { ContactPersonCardService } from './contact-person-card.service';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { ContactPersonCardComponent } from './contact-person-card.component';

import { createMetadataFormReducer } from '@app/shared/components/form/metadata-form/metadata-form.reducer';

const routes: Routes = [
  {
    path: '',
    component: ContactPersonCardComponent,
  }
];

const contactPersonCardPersonFormReducer = createMetadataFormReducer('contactPersonCardPersonForm');
const contactPersonCardSelectPersonFormReducer = createMetadataFormReducer('contactPersonCardSelectPersonForm');

@NgModule({
  declarations: [
    ContactPersonCardComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    CommonModule,
    DynamicLoaderModule.withModules(
      [
        {
          path: 'select-person',
          // tslint:disable-next-line:max-line-length
          loadChildren: 'app/routes/workplaces/debtor-card/contact-persons/card/dynamic-popups/select-person/select-person.module#SelectPersonModule',
        },
      ],
    ),
    RouterModule.forChild(routes),
    SharedModule,
    StoreModule.forFeature('contactPersonCardPersonForm', contactPersonCardPersonFormReducer),
    StoreModule.forFeature('contactPersonCardSelectPersonForm', contactPersonCardSelectPersonFormReducer),
    WorkplacesSharedModule,
  ],
  providers: [
    ContactPersonCardService,
  ],
})
export class ContactPersonCardModule {}
