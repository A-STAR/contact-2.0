import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IToolbarAction } from './toolbar.interface';
import { IconsService } from '../../icons/icons.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {

  @Input() actions: IToolbarAction[];
  @Output() actionClick: EventEmitter<IToolbarAction> = new EventEmitter<IToolbarAction>();

  constructor(private iconsService: IconsService,
              private userPermissionsService: UserPermissionsService) {
  }

  onActionClick(action: IToolbarAction) {
    this.actionClick.emit(action);
  }

  isActionAccessible(action: IToolbarAction): boolean {
    return !action.permission || this.userPermissionsService.hasPermission(action.permission);
  }

  toIconCls(action: IToolbarAction) {
    return this.iconsService.fromActionType(action.type);
  }
}
