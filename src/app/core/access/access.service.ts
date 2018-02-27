import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operators/map';

import {
  IAccessByValueBagMethod,
  IAccessConfig,
  IAccessConfigItem,
  IAccessConfigItemType,
  IAccessConfigOperator,
  IAccessGroup,
  IAccessByEntityMethod,
  IAccessByValueBagConfigItem,
  IAccessByEntityConfigItem,
} from './access.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

import { ValueBag } from '@app/core/value-bag/value-bag';

import { combineLatestAnd, combineLatestOr } from '@app/core/utils';

type ICombiner = (observables: Observable<boolean>[]) => Observable<boolean>;

@Injectable()
export class AccessService {
  constructor(
    private entityAttributesService: EntityAttributesService,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  hasAccess(config: IAccessConfig): Observable<boolean> {
    return this.getAccess(config);
  }

  private getAccess(config: IAccessConfig): Observable<boolean> {
    return config.type === IAccessConfigItemType.GROUP
      ? this.getAccessForGroup(config)
      : this.getAccessForItem(config);
  }

  private getAccessForGroup(config: IAccessGroup): Observable<boolean> {
    const children = config.children.map(child => this.getAccess(child));
    switch (config.operator) {
      case IAccessConfigOperator.AND:
        return combineLatestAnd(children);
      case IAccessConfigOperator.OR:
        return combineLatestOr(children);
      default:
        throw new Error('Invalid group operator');
    }
  }

  private getAccessForItem(item: IAccessConfigItem): Observable<boolean> {
    switch (item.type) {
      case IAccessConfigItemType.CONSTANT:
        return this.getAccessForItemByConstant(item);
      case IAccessConfigItemType.ENTITY:
        return this.getAccessForItemByEntity(item);
      case IAccessConfigItemType.PERMISSION:
        return this.getAccessForItemByPermission(item);
      default:
        throw new Error('Invalid item type');
    }
  }

  private getAccessForItemByConstant(item: IAccessByValueBagConfigItem): Observable<boolean> {
    return this.userConstantsService.bag().pipe(
      map(bag => this.getAccessForItemByValueBag(bag, item)),
    );
  }

  private getAccessForItemByPermission(item: IAccessByValueBagConfigItem): Observable<boolean> {
    return this.userPermissionsService.bag().pipe(
      map(bag => this.getAccessForItemByValueBag(bag, item)),
    );
  }

  private getAccessForItemByValueBag(bag: ValueBag, item: IAccessByValueBagConfigItem): boolean {
    switch (item.method) {
      case IAccessByValueBagMethod.CONTAINS:
        return bag.contains(item.value[0], item.value[1]);
      case IAccessByValueBagMethod.HAS:
        return bag.has(item.value);
      case IAccessByValueBagMethod.NOT_EMPTY:
        return bag.notEmpty(item.value);
      default:
        throw new Error('Invalid item method');
    }
  }

  private getAccessForItemByEntity(item: IAccessByEntityConfigItem): Observable<boolean> {
    return this.entityAttributesService.getAttribute(item.value).pipe(
      map(attribute => {
        switch (item.method) {
          case IAccessByEntityMethod.IS_MANDATORY:
            return attribute.isMandatory;
          case IAccessByEntityMethod.IS_USED:
            return attribute.isUsed;
          default:
            throw new Error('Invalid item method');
        }
      }),
    );
  }
}
