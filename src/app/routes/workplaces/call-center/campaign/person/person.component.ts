import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { ICampaignDebt } from '../campaign.interface';
import { IViewFormItem, IViewFormControl } from '../../../../../shared/components/form/view-form/view-form.interface';

import { CampaignService } from '../campaign.service';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('modules.callCenter.overview');

@Component({
  selector: 'app-call-center-person',
  templateUrl: 'person.component.html'
})
export class PersonComponent {
  controls: IViewFormItem[] = [
    {
      width: 4,
      children: [
        { label: labelKey('debtor.birthDate'), controlName: 'birthDate' } as IViewFormControl,
        { label: labelKey('debtor.docNumber'), controlName: 'docNumber' } as IViewFormControl,
      ],
    },
    {
      width: 4,
      children: [
        { label: labelKey('info.shortInfo'), controlName: 'shortInfo' } as IViewFormControl,
      ],
    },
    {
      width: 4,
      children: [
        { label: labelKey('debtor.personComment'), controlName: 'personComment' } as IViewFormControl,
      ],
    },
  ];

  constructor(
    private campaignService: CampaignService,
  ) {}

  get personFullName$(): Observable<string> {
    return this.campaignService.campaignDebt$.pipe(
      map(campaignDebt => {
        const { personLastName, personFirstName, personMiddleName } = campaignDebt;
        return [ personLastName, personFirstName, personMiddleName ].filter(Boolean).join(' ');
      }),
    );
  }

  get campaignDebt$(): Observable<ICampaignDebt> {
    return this.campaignService.campaignDebt$;
  }
}
