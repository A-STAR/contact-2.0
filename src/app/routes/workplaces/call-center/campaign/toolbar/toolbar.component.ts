import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IToolbarItem, ToolbarItemTypeEnum } from '@app/shared/components/toolbar-2/toolbar-2.interface';

import { CampaignService } from '../campaign.service';
import { ContactRegistrationService } from '@app/routes/workplaces/shared/contact-registration/contact-registration.service';
import { DebtorCardService } from '@app/core/app-modules/debtor-card/debtor-card.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { DialogFunctions } from '@app/core/dialog';

import { combineLatestAnd } from '@app/core/utils/helpers';

@Component({
  selector: 'app-call-center-toolbar',
  templateUrl: 'toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent extends DialogFunctions {
  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON,
      icon: 'fa fa-newspaper-o',
      label: 'Открытие карточки должника',
      action: () => this.openDebtorCard(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REGISTER_CONTACT,
      label: 'Регистрация контакта с типом "Специальное"',
      action: () => this.registerSpecial(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_CHANGE_STATUS,
      label: 'Перевод в проблемные',
      action: () => this.setDialog('change-status'),
      enabled: this.canChangeStatusToProblematic$,
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      icon: 'fa fa-book',
      label: 'Информация о предыдущих долгах',
      action: () => this.setDialog('processed-debts'),
    },
  ];

  dialog: 'processed-debts' | 'change-status' = null;

  constructor(
    private campaignService: CampaignService,
    private contactRegistrationService: ContactRegistrationService,
    private debtorCardService: DebtorCardService,
    private userPermissionsService: UserPermissionsService,
  ) {
    super();
  }

  get canChangeStatusToProblematic$(): Observable<boolean> {
    return combineLatestAnd([
      this.campaignService.isCampaignDebtActive$,
      this.userPermissionsService.contains('DEBT_STATUS_EDIT_LIST', 9),
    ]);
  }

  private openDebtorCard(): void {
    this.campaignService.campaignDebt$
      .pipe(first())
      .subscribe(debt => this.debtorCardService.openByDebtId(debt.debtId));
  }

  private registerSpecial(): void {
    this.campaignService.campaignDebt$
      .pipe(first())
      .subscribe(debt => {
        this.contactRegistrationService.params = {
          debtId: debt.debtId,
          personId: debt.personId,
          personRole: 1,
          contactType: 7,
          campaignId: this.campaignService.campaignId
        };
      });
  }
}
