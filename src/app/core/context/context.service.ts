import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { distinctUntilChanged, finalize, first, map, shareReplay } from 'rxjs/operators';
import { equals } from 'ramda';

import { IAppState } from '@app/core/state/state.interface';
import { IContext, IContextExpression, ContextOperator, IAppContext } from '@app/core/context/context.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { UserConstantsService } from '@app/core/user/constants/user-constants.service';
import { UserPermissionsService } from '@app/core/user/permissions/user-permissions.service';

@Injectable()
export class ContextService {

  private appContext$ = combineLatest(
    this.store.pipe(
      // TODO(d.maltsev): remove ContextOperator.EVAL
      // For now, only changes in layout will be reflected here for performance reasons
      distinctUntilChanged((a: any, b: any) => equals(a.ui, b.ui)),
    ),
    this.entityAttributesService.bag$,
    this.userConstantsService.bag(),
    this.userPermissionsService.bag(),
  );

  private streams = new Map<string, Observable<any>>();

  constructor(
    private entityAttributesService: EntityAttributesService,
    private router: Router,
    private store: Store<IAppState>,
    private userConstantsService: UserConstantsService,
    private userPermissionsService: UserPermissionsService,
  ) {}

  /**
   * Returns Observable that emits the result of context evaluation.
   */
  calculate(context: IContext): Observable<any> {
    const serializedContext = this.serializeContext(context);
    return this.streams.has(serializedContext)
      ? this.streams.get(serializedContext)
      : this.createStream(serializedContext, context);
  }

  private createStream(serializedContext: string, context: IContext): Observable<any> {
    const storeReferences = this.findStoreReferences(context);
    const stream = this.appContext$.pipe(
      map(([ state, attributes, constants, permissions ]) => {
        const value = storeReferences.reduce((acc, key) => ({ ...acc, [key]: this.getStateSlice(state, key) }), {});
        const appContext = { state: value, attributes, constants, permissions };
        return this.calculateFromStore(appContext, context);
      }),
      // Using `shareReplay` instead of `share` because new subscribers will always need last emitted value
      shareReplay(1),
      finalize(() => this.streams.delete(serializedContext)),
    );
    this.streams.set(serializedContext, stream);
    return stream;
  }

  private findStoreReferences(context: IContext): string[] {
    return this.findStoreReferencesRecursively([ context ]).map(item => String(item.value));
  }

  private findStoreReferencesRecursively(contexts: IContext[]): IContextExpression[] {
    return contexts.reduce((acc, item) => {
      if (typeof item === 'object') {
        switch (item.operator) {
          case ContextOperator.EVAL:
            return [ ...acc, item ];
          case ContextOperator.UI_STATE:
            return [ ...acc, { operator: ContextOperator.EVAL, value: `ui.${this.router.url}:${item.value}` } ];
          default:
            return [
              ...acc,
              ...this.findStoreReferencesRecursively(Array.isArray(item.value) ? item.value : [ item.value ]),
            ];
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
    } else if (expression.operator === ContextOperator.UI_STATE) {
      return appContext.state[`ui.${this.router.url}:${expression.value}`];
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

  private serializeContext(context: IContext): string {
    return this.router.url + ':' + JSON.stringify(context);
  }
}
