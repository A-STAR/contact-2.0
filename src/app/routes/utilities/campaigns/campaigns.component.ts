import { ChangeDetectionStrategy, Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { CallService } from '@app/core/calls/call.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { combineLatestAnd } from '@app/core/utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-campaigns',
  templateUrl: './campaigns.component.html',
})
export class CampaignsComponent {

  readonly canDisplayPredictiveCampaigns$ = combineLatestAnd([
    this.userPermissionsService.has('PBX_CAMPAIGN_VIEW'),
    this.callService.settings$.pipe(
      map(settings => settings && settings.usePredictive === 1),
    ),
  ]);

  constructor(
    private callService: CallService,
    private userPermissionsService: UserPermissionsService,
  ) {}
}
