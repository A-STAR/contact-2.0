import { ChangeDetectionStrategy, Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first, map } from 'rxjs/operators';

import { ButtonType } from '@app/shared/components/button/button.interface';
import { ICampaignDebt } from '@app/routes/workplaces/call-center/campaign/campaign.interface';
import { ToolbarItemType, Toolbar } from '@app/shared/components/toolbar/toolbar.interface';

import { CampaignService } from '../../campaign.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { MassOperationsService } from '@app/shared/mass-ops/mass-ops.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd } from '@app/core/utils/helpers';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-call-center-toolbar',
  templateUrl: './toolbar.component.html',
})
export class ToolbarComponent extends DialogFunctions implements OnInit {

  dialog: 'processed-debts' | 'change-status' = null;

  // TODO(d.maltsev): i18n
  private toolbar: Toolbar = {
    label: 'Сальников Андрей Юрьевич',
    items: [
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.DEBT_CARD,
        action: () => this.openDebtorCard(),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.REGISTER_CONTACT,
        label: 'Регистрация контакта с типом "Специальное"',
        action: () => this.registerSpecial(),
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.CHANGE_STATUS,
        label: 'Перевод в проблемные',
        action: () => this.setDialog('change-status'),
        enabled: this.canChangeStatusToProblematic$,
      },
      {
        type: ToolbarItemType.BUTTON,
        buttonType: ButtonType.HISTORY,
        action: () => this.setDialog('processed-debts'),
      },
    ]
  };

  toolbar$: Observable<Toolbar>;

  constructor(
    private cdRef: ChangeDetectorRef,
    private campaignService: CampaignService,
    private contactRegistrationService: ContactRegistrationService,
    private massOpsService: MassOperationsService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.toolbar$ = this.campaignService.campaignDebt$.pipe(
      map(campaignDebt => {
        const { personLastName, personFirstName, personMiddleName } = campaignDebt;
        const title = [ personLastName, personFirstName, personMiddleName ].filter(Boolean).join(' ');
        this.toolbar.label = title;
        return { ...this.toolbar };
      }),
    );
  }

  get canChangeStatusToProblematic$(): Observable<boolean> {
    return combineLatestAnd([
      this.campaignService.isCampaignDebtActive$,
      this.userPermissionsService.contains('DEBT_STATUS_EDIT_LIST', 9),
    ]);
  }

  get campaignDebt$(): Observable<ICampaignDebt> {
    return this.campaignService.campaignDebt$;
  }

  onClose(): void {
    this.onCloseDialog();
    this.cdRef.detectChanges();
  }

  private openDebtorCard(): void {
    this.campaignService.campaignDebt$
      .pipe(first())
      .subscribe(debt => this.massOpsService.openByDebtId(debt.debtId, debt.personId));
  }

  private registerSpecial(): void {
    this.campaignService.campaignDebt$
      .pipe(first())
      .subscribe(debt => this.contactRegistrationService.startRegistration({
        debtId: debt.debtId,
        personId: debt.personId,
        personRole: 1,
        contactType: 7,
        campaignId: this.campaignService.campaignId
      }));
  }
}
