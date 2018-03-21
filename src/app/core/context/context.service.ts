import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map } from 'rxjs/operators/map';

import {
  IContextByValueBagMethod,
  IContextConfig,
  IContextConfigItem,
  IContextConfigItemType,
  IContextConfigOperator,
  IContextGroup,
  IContextByEntityMethod,
  IContextByValueBagConfigItem,
  IContextByEntityItem,
} from './context.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ValueBag } from '@app/core/value-bag/value-bag';

import { combineLatestAnd, combineLatestOr } from '@app/core/utils';

type IContextValue = boolean | number | string;

@Injectable()
export class ContextService {
  constructor(
    private entityAttributesService: EntityAttributesService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  calculate(config: IContextConfig): Observable<IContextValue> {
    return this.eval(config);
  }

  private eval(config: IContextConfig): Observable<IContextValue> {
    return config.type === IContextConfigItemType.GROUP
      ? this.evalGroup(config)
      : this.evalItem(config);
  }

  private evalGroup(config: IContextGroup): Observable<IContextValue> {
    const children = config.children.map(child => this.eval(child));
    switch (config.operator) {
      case IContextConfigOperator.AND:
        return combineLatestAnd(children as any);
      case IContextConfigOperator.OR:
        return combineLatestOr(children as any);
      default:
        return ErrorObservable.create('Invalid group operator');
    }
  }

  private evalItem(item: IContextConfigItem): Observable<IContextValue> {
    switch (item.type) {
      case IContextConfigItemType.CONSTANT:
        return this.evalConstant(item);
      case IContextConfigItemType.ENTITY:
        return this.evalEntity(item);
      case IContextConfigItemType.PERMISSION:
        return this.evalPermission(item);
      default:
        return ErrorObservable.create('Invalid item type');
    }
  }

  private evalConstant(item: IContextByValueBagConfigItem): Observable<IContextValue> {
    return this.userConstantsService.bag().pipe(
      map(bag => this.evalValueBagItem(bag, item)),
    );
  }

  private evalPermission(item: IContextByValueBagConfigItem): Observable<IContextValue> {
    return this.userPermissionsService.bag().pipe(
      map(bag => this.evalValueBagItem(bag, item)),
    );
  }

  private evalValueBagItem(bag: ValueBag, item: IContextByValueBagConfigItem): IContextValue {
    switch (item.method) {
      case IContextByValueBagMethod.CONTAINS:
        return bag.contains(item.value[0], item.value[1]);
      case IContextByValueBagMethod.HAS:
        return bag.has(item.value);
      case IContextByValueBagMethod.NOT_EMPTY:
        return bag.notEmpty(item.value);
      case IContextByValueBagMethod.VALUE:
        return bag.get(item.value);
      default:
        throw new Error('Invalid item method');
    }
  }

  private evalEntity(item: IContextByEntityItem): Observable<boolean> {
    return this.entityAttributesService.getAttribute(item.value).pipe(
      map(attribute => {
        switch (item.method) {
          case IContextByEntityMethod.IS_MANDATORY:
            return attribute.isMandatory;
          case IContextByEntityMethod.IS_USED:
            return attribute.isUsed;
          default:
            throw new Error('Invalid item method');
        }
      }),
    );
  }
}
