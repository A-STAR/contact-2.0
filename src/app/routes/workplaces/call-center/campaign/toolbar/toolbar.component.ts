import { ChangeDetectionStrategy, Component } from '@angular/core';

import { IToolbarItem, ToolbarItemTypeEnum } from '../../../../../shared/components/toolbar-2/toolbar-2.interface';

@Component({
  selector: 'app-call-center-toolbar',
  templateUrl: 'toolbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  toolbarItems: IToolbarItem[] = [
    {
      type: ToolbarItemTypeEnum.BUTTON,
      icon: 'fa fa-newspaper-o',
      label: 'Открытие карточки должника',
      action: () => console.log(),
    },
    {
      type: ToolbarItemTypeEnum.BUTTON_REGISTER_CONTACT,
      label: 'Регистрация контакта с типом "Специальное"',
      action: () => console.log(),
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
      action: () => console.log(),
    },
  ];
}
