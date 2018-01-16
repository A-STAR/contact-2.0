import { Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';

import { ICampaignDebt } from '../campaign.interface';

import { CampaignService } from '../campaign.service';

import { makeKey } from '../../../../../core/utils';

const labelKey = makeKey('modules.callCenter.overview');

@Component({
  selector: 'app-call-center-person',
  templateUrl: 'person.component.html'
})
export class PersonComponent {
  controls = [
    {
      width: 33.33,
      children: [
        { label: labelKey('debtor.birthDate'), name: 'birthDate' },
        { label: labelKey('debtor.docNumber'), name: 'docNumber' },
      ],
    },
    {
      width: 33.33,
      children: [
        { label: labelKey('info.shortInfo'), name: 'shortInfo' },
      ],
    },
    {
      width: 33.33,
      children: [
        { label: labelKey('debtor.personComment'), name: 'personComment' },
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
