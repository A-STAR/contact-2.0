import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as R from 'ramda';

import {
  IToolbarAction,
  IToolbarActionSelectPayload,
  ToolbarControlEnum
} from './toolbar.interface';
import { ILabeledValue } from '../../../core/converter/value/value-converter.interface';

import { IconsService } from '../../icons/icons.service';
import { UserPermissionsService } from '../../../core/user/permissions/user-permissions.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit, OnChanges {

  @Input() actions: IToolbarAction[];
  @Input() actionAlign = 'left';
  @Output() actionClick: EventEmitter<IToolbarAction> = new EventEmitter<IToolbarAction>();
  @Output() actionSelect: EventEmitter<IToolbarActionSelectPayload> = new EventEmitter<IToolbarActionSelectPayload>();

  ToolbarControlEnum = ToolbarControlEnum;

  constructor(
    private iconsService: IconsService,
    private userPermissionsService: UserPermissionsService
  ) {}

  ngOnInit(): void {
    const prop = 'visible';
    this.actions = this.actions.map(R.over(R.lensProp(prop), R.propOr(true, prop)));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.actions) {
      const prop = 'visible';
      this.actions = this.actions.map(R.over(R.lensProp(prop), R.propOr(true, prop)));
    }
  }

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
    const permissions = Array.isArray(action.permission) ? action.permission : [ action.permission ];
    return this.userPermissionsService.hasAll(permissions)
      .map(permission => !!action.disabled || !(!action.permission || permission));
  }

  toIconCls(action: IToolbarAction): string {
    return this.iconsService.fromActionType(action.type);
  }
}
