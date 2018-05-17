import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged, first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { equals } from 'ramda';

import { IAppState } from '@app/core/state/state.interface';
import { ContextOperator, IAppContext, IContext, IContextExpression } from './dynamic-layout.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class ContextService {
  constructor(
    private entityAttributesService: EntityAttributesService,
    private store: Store<IAppState>,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  /**
   * Returns Observable that emits the result of context evaluation.
   *
   * CAUTION:
   * Absolutely make sure to dispose of it once you don't need it anymore!
   *
   * Don't use it in getters (it will create new stream on every getter call), i.e:
   * ```typescript
   * class Foo {
   *  get foo(): Observable<boolean> {
   *    return this.contextService.calculate(this.context)
   *  }
   * }
   * ```
   */
  calculate(context: IContext): Observable<any> {
    const storeReferences = this.findStoreReferences(context);
    return combineLatest(
      this.store.pipe(
        // TODO(d.maltsev): remove ContextOperator.EVAL
        // For now, only changes in layout will be reflected here for performance reasons
        distinctUntilChanged((a: any, b: any) => equals(a.layout, b.layout)),
      ),
      this.entityAttributesService.bag$,
      this.userConstantsService.bag(),
      this.userPermissionsService.bag(),
    ).pipe(
      select(([ state, attributes, constants, permissions ]) => {
        const value = storeReferences.reduce((acc, key) => ({ ...acc, [key]: this.getStateSlice(state, key) }), {});
        const appContext = { state: value, attributes, constants, permissions };
        return this.calculateFromStore(appContext, context);
      }),
      distinctUntilChanged(),
    );
  }

  private findStoreReferences(context: IContext): string[] {
    return this.findStoreReferencesRecursively([ context ]).map(item => String(item.value));
  }

  private findStoreReferencesRecursively(contexts: IContext[]): IContextExpression[] {
    return contexts.reduce((acc, item) => {
      if (typeof item === 'object') {
        if (item.operator === ContextOperator.EVAL) {
          return [ ...acc, item ];
        } else {
          const value = Array.isArray(item.value) ? item.value : [ item.value ];
          return [ ...acc, ...this.findStoreReferencesRecursively(value) ];
        }
      } else {
        return acc;
      }
    }, []);
  }

  private getStateSlice(state: IAppState, key: string): any {
    return key.split('.').reduce((acc, chunk) => acc ? acc[chunk] : null, state);
  }

  private calculateFromStore(appContext: IAppContext, context: IContext): any {
    return typeof context === 'object'
      ? this.calculateExpression(appContext, context)
      : context;
  }

  private calculateExpression(appContext: IAppContext, expression: IContextExpression): any {
    if (expression.operator === ContextOperator.EVAL) {
      return appContext.state[expression.value];
    } else {
      const v = Array.isArray(expression.value)
        ? expression.value.map(e => this.calculateFromStore(appContext, e))
        : this.calculateFromStore(appContext, expression.value);
      switch (expression.operator) {
        case ContextOperator.AND:
          return v.reduce((acc, item) => acc && item, true);
        case ContextOperator.ENTITY_IS_MANDATORY:
          this.entityAttributesService
            .getAttribute(v)
            .pipe(first())
            .subscribe();
          return appContext.attributes[v] && appContext.attributes[v].isMandatory;
        case ContextOperator.ENTITY_IS_USED:
          this.entityAttributesService
            .getAttribute(v)
            .pipe(first())
            .subscribe();
          return appContext.attributes[v] && appContext.attributes[v].isUsed;
        case ContextOperator.EQUALS:
          return String(v[0]) === String(v[1]);
        case ContextOperator.CONSTANT_CONTAINS:
          return appContext.constants.contains(v[0], v[1]);
        case ContextOperator.CONSTANT_IS_TRUE:
          return appContext.constants.has(v);
        case ContextOperator.CONSTANT_NOT_EMPTY:
          return appContext.constants.notEmpty(v);
        case ContextOperator.PERMISSION_CONTAINS:
          return appContext.permissions.contains(v[0], v[1]);
        case ContextOperator.PERMISSION_IS_TRUE:
          return appContext.permissions.has(v);
        case ContextOperator.PERMISSION_NOT_EMPTY:
          return appContext.permissions.notEmpty(v);
        case ContextOperator.NOT:
          return !v;
        case ContextOperator.NOT_NULL:
          return Boolean(v);
        case ContextOperator.OR:
          return v.reduce((acc, item) => acc || item, false);
        case ContextOperator.PERSON_ATTRIBUTES:
          return this.getPersonAttributeConstantName(v);
      }
    }
  }

  private getPersonAttributeConstantName(value: number): string {
    switch (value) {
      case 1:
        return 'Person.Individual.AdditionalAttribute.List';
      case 2:
        return 'Person.LegalEntity.AdditionalAttribute.List';
      case 3:
        return 'Person.SoleProprietorship.AdditionalAttribute.List';
      default:
        return null;
    }
  }
}
