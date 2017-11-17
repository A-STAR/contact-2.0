import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

import { CampaignService } from '../campaign.service';
import { DebtService } from '../../../../../core/debt/debt.service';

import { DialogFunctions } from '../../../../../core/dialog';

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
      action: () => console.log(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_NEXT,
      label: 'Переход к следующему долгу',
      action: () => console.log(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON,
      icon: 'fa fa-book',
      label: 'Информация о предыдущих долгах',
      action: () => this.setDialog('processed-debts'),
    },
  ];

  dialog: 'processed-debts' = null;

  constructor(
    private campaignService: CampaignService,
    private debtService: DebtService,
  ) {
    super();
  }

  private openDebtorCard(): void {
    this.campaignService.campaignDebt$
      .take(1)
      .subscribe(debt => this.debtService.navigateToDebtorCard(debt.debtId, debt.personId));
  }

  private registerSpecial(): void {
    this.campaignService.campaignDebt$
      .take(1)
      .subscribe(debt => this.debtService.navigateToRegistration({
        debtId: debt.debtId,
        personId: debt.personId,
        personRole: 1,
        contactType: 7,
        campaignId: this.campaignService.campaignId
      }));
  }
}