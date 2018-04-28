import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators';

import { IAppState } from '@app/core/state/state.interface';
import { IContext, IContextExpression, ContextOperator } from './dynamic-layout.interface';

@Injectable()
export class ContextService {
  constructor(
    private store: Store<IAppState>,
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
    const resolvedContext = this.resolveMetaOperatorsRecursively(context);
    const storeReferences = this.findStoreReferences(resolvedContext);
    return this.store.pipe(
      select(state => {
        const value = storeReferences.reduce((acc, key) => ({ ...acc, [key]: this.getStateSlice(state, key) }), {});
        return this.calculateFromStore(value, resolvedContext);
      }),
      distinctUntilChanged(),
    );
  }

  private resolveMetaOperatorsRecursively(context: IContext): IContext {
    return typeof context === 'object'
      ? this.resolveMetaOperators(context)
      : context;
  }

  private resolveMetaOperators(expression: IContextExpression): IContext {
    switch (expression.operator) {
      case ContextOperator.PERMISSION:
        return {
          ...expression,
        };
      case ContextOperator.ATTRIBUTE:
        return {
          ...expression,
        };
      case ContextOperator.CONSTANT:
        return {
          ...expression,
        };
      case ContextOperator.PERSON_ATTRIBUTES:
        return {
          ...expression,
        };
      default:
        return {
          ...expression,
          value: Array.isArray(expression.value)
            ? expression.value.map(e => this.resolveMetaOperatorsRecursively(e))
            : this.resolveMetaOperatorsRecursively(expression.value),
        };
    }
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

  private calculateFromStore(value: Record<string, any>, context: IContext): any {
    return typeof context === 'object'
      ? this.calculateExpression(value, context)
      : context;
  }

  private calculateExpression(value: Record<string, any>, expression: IContextExpression): any {
    switch (expression.operator) {
      case ContextOperator.AND:
        return (expression.value as any[]).reduce((acc, e) => acc && this.calculateExpression(value, e), true);
      case ContextOperator.EVAL:
        return value[expression.value as any];
    }
  }
}
