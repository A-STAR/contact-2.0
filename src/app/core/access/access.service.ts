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
    return config.type === 'group'
      ? this.getAccessForGroup(config)
      : this.getAccessForItem(config);
  }

  private getAccessForGroup(config: IAccessGroup): Observable<boolean> {
    const children = config.children.map(child => this.getAccess(child));
    return this.getCombiner(config.operator)(children);
  }

  private getCombiner(operator: IAccessConfigOperator): ICombiner {
    switch (operator) {
      case IAccessConfigOperator.AND:
        return combineLatestAnd;
      case IAccessConfigOperator.OR:
        return combineLatestOr;
      default:
        return () => of(false);
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
        return of(false);
    }
  }

  private getAccessForItemByConstant(item: IAccessByValueBagConfigItem): Observable<boolean> {
    return this.userConstantsService.bag().pipe(
      map(bag => {
        switch (item.method) {
          case IAccessByValueBagMethod.CONTAINS:
            return bag.contains.apply(null, item.value);
          case IAccessByValueBagMethod.HAS:
            return bag.has.apply(null, item.value);
          case IAccessByValueBagMethod.NOT_EMPTY:
            return bag.notEmpty.apply(null, item.value);
          default:
            return false;
        }
      }),
    );
  }

  private getAccessForItemByEntity(item: IAccessByEntityConfigItem): Observable<boolean> {
    const attributeId = Number(item.value[0]);
    return this.entityAttributesService.getAttribute(attributeId).pipe(
      map(attribute => {
        switch (item.method) {
          case IAccessByEntityMethod.IS_MANDATORY:
            return attribute.isMandatory;
          case IAccessByEntityMethod.IS_USED:
            return attribute.isUsed;
          default:
            return false;
        }
      }),
    );
  }

  private getAccessForItemByPermission(item: IAccessByValueBagConfigItem): Observable<boolean> {
    return this.userPermissionsService.bag().pipe(
      map(bag => {
        switch (item.method) {
          case IAccessByValueBagMethod.CONTAINS:
            return bag.contains.apply(null, item.value);
          case IAccessByValueBagMethod.HAS:
            return bag.has.apply(null, item.value);
          case IAccessByValueBagMethod.NOT_EMPTY:
            return bag.notEmpty.apply(null, item.value);
          default:
            return false;
        }
      }),
    );
  }
}
