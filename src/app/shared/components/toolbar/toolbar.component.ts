import {Component, EventEmitter, Input, Output} from '@angular/core';
import {IToolbarAction, ToolbarActionTypeEnum} from './toolbar.interface';
import {IconsService} from "../../icons/icons.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {

  @Input() actions: IToolbarAction[];
  @Output() actionClick: EventEmitter<IToolbarAction> = new EventEmitter<IToolbarAction>(false);

  constructor(private iconsService: IconsService) {
  }

  onActionClick(action: IToolbarAction) {
    this.actionClick.emit(action);
  }

  toIconCls(action: IToolbarAction) {
    return this.iconsService.byIconCls(action.type);
  }
}
