import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { first } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';
import { IAppState } from '@app/core/state/state.interface';
import { IDynamicFormControl } from '../../form/dynamic-form/dynamic-form.interface';
import { IMetadataColumn, IMetadataFilterOperator } from '@app/core/metadata/metadata.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { TYPE_CODES } from '@app/core/utils/value';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-grid-filter',
  templateUrl: './action-grid-filter.component.html'
})
export class ActionGridFilterComponent implements OnInit, OnDestroy {
  @Input() metadataKey: string;
  @Input() data: any;
  @Output() onChange = new EventEmitter<{ values: any, status: boolean }>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  formControls: IDynamicFormControl[];
  isValid$ = new BehaviorSubject<boolean>(true);
  values$ = new BehaviorSubject<any>(null);

  private operators: IMetadataFilterOperator[] = [];
  private columnsMetadata: IMetadataColumn[];
  private changesSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService
  ) {}

  ngOnInit(): void {

    combineLatest(
      this.entityAttributesService.getDictValueAttributes(),
      this.store.select(state => state.metadata)
        .map(metadata => metadata && metadata[this.metadataKey])
        .filter(Boolean)
    )
    .pipe(first())
    .filter(([_, metadata]) => metadata.columns && metadata.filters)
    .subscribe(([_, metadata]) => {
      this.formControls = metadata.filters.controls;
      this.operators = metadata.filters.operators;
      this.columnsMetadata = metadata.columns;
      this.cdRef.markForCheck();
    });

    this.changesSub = combineLatest(
        this.isValid$,
        this.values$
      )
      .map(([ status, values ]) => ({ status, values }))
      .subscribe(event => this.onChange.emit(event));

  }

  ngOnDestroy(): void {
    if (this.changesSub) {
      this.changesSub.unsubscribe();
    }
  }

  get isValid(): boolean {
    return this.form && this.form.isValid;
  }

  onFilterStatusChange($event: boolean): void {
    this.isValid$.next($event);
  }

  onFilterValuesChanges($event: any): void {
    this.values$.next($event);
  }

  get filters(): FilterObject {
    const filter = FilterObject.create().and();
    const data = this.form && this.form.serializedValue || {};

    this.operators.forEach(operator => {
      if (this.hasControlValues(data, operator.controls)) {
        const f = FilterObject
        .create()
        .setName(operator.columnName)
        .setOperator(operator.type)
        .setValues(this.setFilterValues(data, operator));
        filter.addFilter(f);
      }
    });
    return filter;
  }

  private pickControlValues(data: any, props: any[]): any[] {
    return props.filter(prop => !!data[prop]).reduce((acc, prop) => [...acc, ...data[prop]], []);
  }

  private hasControlValues(data: any, props: any[]): boolean {
    return props.some(prop => !!data[prop]);
  }
  private setFilterValues(data: any, operator: IMetadataFilterOperator): any[] {
    return this.transformFilterValue(this.pickControlValues(data, operator.controls), operator);
  }

  private transformFilterValue(values: any[], operator: IMetadataFilterOperator): any[] {
    const columnMetadata = this.columnsMetadata.find(column => column.name === operator.columnName);
    switch (columnMetadata.dataType) {
      case TYPE_CODES.DATETIME:
        return values.length === 1 ? this.valueConverterService.makeRangeFromLocalDate(values[0]) : values;
      default:
        return values;
    }
  }
}
