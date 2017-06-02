import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IToolbarAction, ToolbarControlEnum } from './toolbar.interface';
import { IconsService } from '../../icons/icons.service';
import { PermissionsService } from '../../../core/permissions/permissions.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {

  @Input() actions: IToolbarAction[];
  @Input() actionAlign = 'left';
  @Output() actionClick: EventEmitter<IToolbarAction> = new EventEmitter<IToolbarAction>();

  ToolbarControlEnum = ToolbarControlEnum;

  constructor(private iconsService: IconsService,
              private permissionsService: PermissionsService) {
  }

  onActionClick(action: IToolbarAction, event: any): void {
    this.actionClick.emit({
      ...action,
      value: action.control === ToolbarControlEnum.CHECKBOX ? event.target.checked : undefined
    });
  }

  isActionAccessible(action: IToolbarAction): boolean {
    return !action.permission || this.permissionsService.hasOnePermission(action.permission);
  }

  toIconCls(action: IToolbarAction): string {
    return this.iconsService.fromActionType(action.type);
  }
}
