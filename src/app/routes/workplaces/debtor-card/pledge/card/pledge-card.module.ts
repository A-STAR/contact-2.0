import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { PledgeCardService } from './pledge-card.service';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { PledgeCardComponent } from './pledge-card.component';

import { createMetadataFormReducer } from '@app/shared/components/form/metadata-form/metadata-form.reducer';

const routes: Routes = [
  {
    path: '',
    component: PledgeCardComponent,
  }
];

@NgModule({
  declarations: [
    PledgeCardComponent,
  ],
  exports: [
    RouterModule,
  ],
  imports: [
    CommonModule,
    DynamicLoaderModule.withModules(
      [
        {
          path: 'select-property',
          // tslint:disable-next-line:max-line-length
          loadChildren: 'app/routes/workplaces/debtor-card/pledge/card/dynamic-popups/select-property/select-property.module#SelectPropertyModule',
        },
        {
          path: 'select-person',
          // tslint:disable-next-line:max-line-length
          loadChildren: 'app/routes/workplaces/debtor-card/pledge/card/dynamic-popups/select-person/select-person.module#SelectPersonModule',
        },
      ],
    ),
    RouterModule.forChild(routes),
    StoreModule.forFeature('pledgeCardContractForm', createMetadataFormReducer('pledgeCardContractForm')),
    StoreModule.forFeature('pledgeCardPledgorForm', createMetadataFormReducer('pledgeCardPledgorForm')),
    StoreModule.forFeature('pledgeCardPropertyForm', createMetadataFormReducer('pledgeCardPropertyForm')),
    StoreModule.forFeature('pledgeCardSelectPersonForm', createMetadataFormReducer('pledgeCardSelectPersonForm')),
    SharedModule,
    WorkplacesSharedModule,
  ],
  providers: [
    PledgeCardService,
  ],
})
export class PledgeCardModule {}
