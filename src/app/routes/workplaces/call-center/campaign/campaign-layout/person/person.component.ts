import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { ICampaignDebt } from '../../campaign.interface';
import { IViewFormItem, IViewFormControl } from '@app/shared/components/form/view-form/view-form.interface';

import { CampaignService } from '../../campaign.service';

import { makeKey } from '@app/core/utils';

const labelKey = makeKey('modules.callCenter.overview');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
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

  get campaignDebt$(): Observable<ICampaignDebt> {
    return this.campaignService.campaignDebt$;
  }
}
