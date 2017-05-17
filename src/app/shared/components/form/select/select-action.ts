import { ISelectComponent, ISelectionAction, SelectionActionTypeEnum } from './select-interfaces';
import { SelectItem } from './select-item';

export class SelectActionHandler {

  constructor(private selectComponent: ISelectComponent) {
  }

  handle(action: ISelectionAction): void {
    switch (action.type) {
      case SelectionActionTypeEnum.SORT:
        if (action.state === 'down') {
          action.state = 'up';
          action.actionIconCls = 'fa fa-arrow-up';

          this.selectComponent.options.sort((item1: SelectItem, item2: SelectItem) => item1.text.localeCompare(item2.text));
        } else {
          action.state = 'down';
          action.actionIconCls = 'fa fa-arrow-down';

          this.selectComponent.options.sort((item1: SelectItem, item2: SelectItem) => item2.text.localeCompare(item1.text));
        }
        break;
    }
  }
}
