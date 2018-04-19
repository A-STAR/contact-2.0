import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { DynamicLoaderModule } from '@app/core/dynamic-loader/dynamic-loader.module';
import { GuaranteeCardService } from './guarantee-card.service';
import { SharedModule } from '@app/shared/shared.module';
import { WorkplacesSharedModule } from '@app/routes/workplaces/shared/shared.module';

import { GuarantorCardComponent } from './guarantee-card.component';

import {
  createMetadataFormReducer,
  IMetadataFormState,
  IMetadataFormAction,
} from '@app/shared/components/form/metadata-form/metadata-form.reducer';

const routes: Routes = [
  {
    path: '',
    component: GuarantorCardComponent,
  }
];

export function guaranteeCardContractFormReducer(state: IMetadataFormState, action: IMetadataFormAction): IMetadataFormState {
  return createMetadataFormReducer('guaranteeCardContractForm')(state, action);
}

export function guaranteeCardGuarantorFormReducer(state: IMetadataFormState, action: IMetadataFormAction): IMetadataFormState {
  return createMetadataFormReducer('guaranteeCardGuarantorForm')(state, action);
}

export function guaranteeCardSelectPersonFormReducer(state: IMetadataFormState, action: IMetadataFormAction): IMetadataFormState {
  return createMetadataFormReducer('guaranteeCardSelectPersonForm')(state, action);
}

@NgModule({
  declarations: [
    GuarantorCardComponent,
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
          loadChildren: 'app/routes/workplaces/debtor-card/guarantee/card/dynamic-popups/select-person/select-person.module#SelectPersonModule',
        },
      ],
    ),
    RouterModule.forChild(routes),
    StoreModule.forFeature('guaranteeCardContractForm', guaranteeCardContractFormReducer),
    StoreModule.forFeature('guaranteeCardGuarantorForm', guaranteeCardGuarantorFormReducer),
    StoreModule.forFeature('guaranteeCardSelectPersonForm', guaranteeCardSelectPersonFormReducer),
    SharedModule,
    WorkplacesSharedModule,
  ],
  providers: [
    GuaranteeCardService,
  ],
})
export class GuaranteeCardModule {}
