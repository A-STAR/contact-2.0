import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { first } from 'rxjs/operators';

import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { CampaignService } from '../campaign.service';
import { DebtorCardService } from '../../../../../core/app-modules/debtor-card/debtor-card.service';
import { DebtService } from '../../../../../core/debt/debt.service';
import { UserPermissionsService } from '../../../../../core/user/permissions/user-permissions.service';

import { DialogFunctions } from '../../../../../core/dialog';

import { combineLatestAnd } from '../../../../../core/utils/helpers';

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
      type: ToolbarItemTypeEnum.BUTTON_NEXT,
      label: 'Переход к следующему долгу',
      action: () => this.toNextDebt(),
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
    private debtorCardService: DebtorCardService,
    private debtService: DebtService,
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
      .subscribe(debt => this.debtorCardService.navigate({ debtId: debt.debtId }));
  }

  private registerSpecial(): void {
    this.campaignService.campaignDebt$
      .pipe(first())
      .subscribe(debt => this.debtService.navigateToRegistration({
        debtId: debt.debtId,
        personId: debt.personId,
        personRole: 1,
        contactType: 7,
        campaignId: this.campaignService.campaignId
      }));
  }

  private toNextDebt(): void {
    this.campaignService
      .markCurrentDebtAsFinished()
      .subscribe(() => {
        this.campaignService.preloadCampaignDebt();
      });
  }
}
