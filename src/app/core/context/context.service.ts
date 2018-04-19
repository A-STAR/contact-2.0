import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { select, Store } from '@ngrx/store';

import { IAppState } from '@app/core/state/state.interface';
import {
  IContextByEntityItem,
  IContextByEntityMethod,
  IContextByExpressionMethod,
  IContextByStateItem,
  IContextByStateMethod,
  IContextByValueBagConfigItem,
  IContextByValueBagMethod,
  IContextConfig,
  IContextConfigItem,
  IContextConfigItemType,
  IContextConfigOperator,
  IContextGroup,
  IContextByExpressionItem,
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
    private store: Store<IAppState>,
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
      case IContextConfigItemType.STATE:
        return this.evalState(item);
      case IContextConfigItemType.EXPRESSION:
        return this.evalExpression(item);
      default:
        return ErrorObservable.create('Invalid item type');
    }
  }

  private evalConstant(item: IContextByValueBagConfigItem): Observable<IContextValue> {
    return this.userConstantsService.bag().pipe(
      mergeMap(bag => this.evalValueBagItem(bag, item)),
    );
  }

  private evalPermission(item: IContextByValueBagConfigItem): Observable<IContextValue> {
    return this.userPermissionsService.bag().pipe(
      mergeMap(bag => this.evalValueBagItem(bag, item)),
    );
  }

  private evalValueBagItem(bag: ValueBag, item: IContextByValueBagConfigItem): Observable<IContextValue> {
    switch (item.method) {
      case IContextByValueBagMethod.CONTAINS:
        // TODO(d.maltsev):
        // this is ugly and inconsistent
        // we need a way to allow expressions as any operand
        return typeof item.name === 'object'
          ? this.eval(item.name).pipe(
              map(String),
              map(n => bag.contains(n, item.value)),
            )
          : of(bag.contains(item.name, item.value));
      case IContextByValueBagMethod.HAS:
        return of(bag.has(item.value));
      case IContextByValueBagMethod.NOT_EMPTY:
        return of(bag.notEmpty(item.value));
      case IContextByValueBagMethod.VALUE:
        return of(bag.get(item.value));
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

  private evalState(item: IContextByStateItem): Observable<any> {
    switch (item.method) {
      case IContextByStateMethod.VALUE:
        return this.getFromStore(item.key);
      case IContextByStateMethod.NOT_EMPTY:
        return this.getFromStore(item.key).pipe(
          map(Boolean),
        );
      case IContextByStateMethod.EQUALS:
        return this.getFromStore(item.key).pipe(
          map(v => v === item.value),
        );
      default:
        throw new Error('Invalid item method');
    }
  }

  private getFromStore(key: string): Observable<any> {
    return this.store.pipe(
      select(state => key.split('.').reduce((acc, chunk) => acc ? acc[chunk] : null, state)),
    );
  }

  private evalExpression(item: IContextByExpressionItem): Observable<any> {
    switch (item.method) {
      case IContextByExpressionMethod.SWITCH:
        return this.eval(item.key).pipe(
          map(String),
          map(k => item.value[k]),
        );
      default:
        throw new Error('Invalid item method');
    }
  }
}
