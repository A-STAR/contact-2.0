import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ITab } from '../../../shared/components/layout/tabview/header/header.interface';

import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { makeKey } from '../../../core/utils';

const label = makeKey('modules.debtsProcessing');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-debt-processing',
  templateUrl: './debt-processing.component.html',
})
export class DebtProcessingComponent {
  tabs: ITab[] = [
    {
      link: 'all',
      hasPermission: this.userPermissionsService.has('DEBT_PROCESSING_TAB_ALL')
    },
    {
      link: 'callBack',
      hasPermission: this.userPermissionsService.has('DEBT_PROCESSING_TAB_CALL_BACK')
    },
    {
      link: 'currentJob',
      hasPermission: this.userPermissionsService.has('DEBT_PROCESSING_TAB_CURRENT_JOB')
    },
    {
      link: 'visits',
      hasPermission: this.userPermissionsService.has('DEBT_PROCESSING_TAB_VISITS')
    },
    {
      link: 'promisePay',
      hasPermission: this.userPermissionsService.has('DEBT_PROCESSING_TAB_PROMISE_PAY')
    },
    {
      link: 'partPay',
      hasPermission: this.userPermissionsService.has('DEBT_PROCESSING_TAB_PART_PAY')
    },
    {
      link: 'problem',
      hasPermission: this.userPermissionsService.has('DEBT_PROCESSING_TAB_PROBLEM')
    },
    {
      link: 'returned',
      hasPermission: this.userPermissionsService.has('DEBT_PROCESSING_TAB_RETURN')
    },
  ].map(tab => ({ ...tab, title: label(`${tab.link}.title`) }));

  constructor(
    private userPermissionsService: UserPermissionsService
  ) { }
}
