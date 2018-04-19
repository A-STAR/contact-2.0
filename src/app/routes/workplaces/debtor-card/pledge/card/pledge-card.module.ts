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

export const pledgeCardContractFormReducer = createMetadataFormReducer('pledgeCardContractForm');
export const pledgeCardPledgorFormReducer = createMetadataFormReducer('pledgeCardPledgorForm');
export const pledgeCardPropertyFormReducer = createMetadataFormReducer('pledgeCardPropertyForm');
export const pledgeCardSelectPersonFormReducer = createMetadataFormReducer('pledgeCardSelectPersonForm');

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
    StoreModule.forFeature('pledgeCardContractForm', pledgeCardContractFormReducer),
    StoreModule.forFeature('pledgeCardPledgorForm', pledgeCardPledgorFormReducer),
    StoreModule.forFeature('pledgeCardPropertyForm', pledgeCardPropertyFormReducer),
    StoreModule.forFeature('pledgeCardSelectPersonForm', pledgeCardSelectPersonFormReducer),
    SharedModule,
    WorkplacesSharedModule,
  ],
  providers: [
    PledgeCardService,
  ],
})
export class PledgeCardModule {}
