import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { IToolbarAction, IToolbarActionSelect, ToolbarControlEnum } from './toolbar.interface';

import { ToolbarService } from './toolbar.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent {
  @Input() actions: IToolbarAction[] = [];
  @Output() actionClick: EventEmitter<IToolbarAction> = new EventEmitter<IToolbarAction>();
  @Output() actionSelect: EventEmitter<IToolbarActionSelect> = new EventEmitter<IToolbarActionSelect>();

  ToolbarControlEnum = ToolbarControlEnum;

  constructor(
    private toolbarService: ToolbarService,
    private userPermissionsService: UserPermissionsService
  ) {}

  onActionClick(action: IToolbarAction, event: any): void {
    this.actionClick.emit({
      ...action,
      value: action.control === ToolbarControlEnum.CHECKBOX ? event.target.checked : undefined
    });
  }

  onSelect(action: IToolbarAction, value: any): void {
    this.actionSelect.emit({ action, value } as IToolbarActionSelect);
  }

  isActionDisabled(action: IToolbarAction): Observable<boolean> {
    if (!action.permission) {
      return of(!!action.disabled);
    }
    const permissions = Array.isArray(action.permission) ? action.permission : [ action.permission ];
    return this.userPermissionsService.hasAll(permissions)
      .map(permission => !!action.disabled || !(!action.permission || permission));
  }

  getIconCls(action: IToolbarAction): string {
    return this.toolbarService.getIconClass(action.type);
  }
}
