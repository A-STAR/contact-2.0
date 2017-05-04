import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IToolbarAction, ToolbarActionTypeEnum} from './toolbar.interface';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html'
})
export class ToolbarComponent {

  @Input() actions: IToolbarAction[];
  @Output() actionClick: EventEmitter<IToolbarAction> = new EventEmitter<IToolbarAction>(false);

  onActionClick(action: IToolbarAction) {
    this.actionClick.emit(action);
  }

  toIconCls(action: IToolbarAction) {
    // TODO Make it generic
    switch (action.type) {
      case ToolbarActionTypeEnum.CLONE:
        return 'clone';
      case ToolbarActionTypeEnum.EDIT:
        return 'pencil-square-o';
      case ToolbarActionTypeEnum.REMOVE:
        return 'trash-o';
      case ToolbarActionTypeEnum.ADD:
        return 'plus-square-o';
      default:
        return 'default';
    }
  }
}
