import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IToolbarAction, ToolbarActionTypeEnum} from './toolbar.interface';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
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
        return 'pencil';
      case ToolbarActionTypeEnum.REMOVE:
        return 'trash';
      case ToolbarActionTypeEnum.ADD:
        return 'plus';
      default:
        return 'default';
    }
  }
}
