import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ITab } from '@app/shared/components/layout/tabview/header/header.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { makeKey } from '@app/core/utils';

const label = makeKey('widgets.groups.tabs');

@Component({
  selector: 'app-schedule',
  host: { class: 'full-height' },
  templateUrl: './schedule.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent {

  constructor(
    private userPermissionsService: UserPermissionsService
  ) { }

  tabs: ITab[] = [
    { link: 'all', title: label('all'), hasPermission: this.userPermissionsService.has('GROUP_VIEW') },
    { link: 'debts', title: label('debtsInGroup'), hasPermission: this.userPermissionsService.has('GROUP_TAB_DEBT_GROUP') },
    { link: 'schedule', title: label('scheduleEvents'), hasPermission: this.userPermissionsService.has('SCHEDULE_VIEW') },
  ];
}
