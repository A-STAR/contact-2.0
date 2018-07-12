import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

import { PaginationAction, PaginationActionSelect, PaginationControl } from './pagination.interface';

import { PaginationService } from './pagination.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-pagination',
  templateUrl: 'pagination.component.html',
  styleUrls: ['./pagination.component.scss'],
})
export class PaginationComponent {
  @Input() actions: PaginationAction[] = [];
  @Output() actionClick: EventEmitter<PaginationAction> = new EventEmitter<PaginationAction>();
  @Output() actionSelect: EventEmitter<PaginationActionSelect> = new EventEmitter<PaginationActionSelect>();

  control = PaginationControl;

  constructor(
    private paginationService: PaginationService,
    private userPermissionsService: UserPermissionsService
  ) {}

  onActionClick(action: PaginationAction, event: any): void {
    this.actionClick.emit({
      ...action,
      value: action.control === PaginationControl.CHECKBOX ? event.target.checked : undefined
    });
  }

  onSelect(action: PaginationAction, value: any): void {
    this.actionSelect.emit({ action, value } as PaginationActionSelect);
  }

  isActionDisabled(action: PaginationAction): Observable<boolean> {
    if (!action.permission) {
      return of(!!action.disabled);
    }
    const permissions = Array.isArray(action.permission) ? action.permission : [ action.permission ];
    return this.userPermissionsService.hasAll(permissions)
      .map(permission => !!action.disabled || !(!action.permission || permission));
  }

  getIconCls(action: PaginationAction): string {
    return this.paginationService.getIconClass(action.type);
  }
}
