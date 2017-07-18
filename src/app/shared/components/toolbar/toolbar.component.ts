import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IToolbarAction, IToolbarActionSelect, ToolbarControlEnum } from './toolbar.interface';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';

import { IconsService } from '../../icons/icons.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

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
    private iconsService: IconsService,
    private userPermissionsService: UserPermissionsService
  ) {}

  onActionClick(action: IToolbarAction, event: any): void {
    this.actionClick.emit({
      ...action,
      value: action.control === ToolbarControlEnum.CHECKBOX ? event.target.checked : undefined
    });
  }

  onSelect(action: IToolbarAction, activeValues: ILabeledValue[]): void {
    this.actionSelect.emit({
      action: action,
      value: activeValues
    });
  }

  isActionDisabled(action: IToolbarAction): Observable<boolean> {
    if (!action.permission) {
      return Observable.of(!!action.disabled);
    }
    const permissions = Array.isArray(action.permission) ? action.permission : [ action.permission ];
    return this.userPermissionsService.hasAll(permissions)
      .map(permission => !!action.disabled || !(!action.permission || permission));
  }

  toIconCls(action: IToolbarAction): string {
    return this.iconsService.fromActionType(action.type);
  }
}
