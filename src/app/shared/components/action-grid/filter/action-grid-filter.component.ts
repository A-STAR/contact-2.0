import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  Input
} from '@angular/core';
import { Store } from '@ngrx/store';
import { first } from 'rxjs/operators';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { FilterObject } from '@app/shared/components/grid2/filter/grid-filter';
import { IAppState } from '@app/core/state/state.interface';
import { IDynamicFormControl, IDynamicFormConfig } from '../../form/dynamic-form/dynamic-form.interface';
import { IMetadataColumn, IMetadataFilter, IMetadataFilterOperator } from '@app/core/metadata/metadata.interface';

import { EntityAttributesService } from '@app/core/entity/attributes/entity-attributes.service';
import { ValueConverterService } from '@app/core/converter/value-converter.service';

import { DynamicFormComponent } from '@app/shared/components/form/dynamic-form/dynamic-form.component';

import { TYPE_CODES } from '@app/core/utils/value';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-action-grid-filter',
  templateUrl: './action-grid-filter.component.html'
})
export class ActionGridFilterComponent implements OnInit {
  @Input() metadataKey: string;

  @Output() filter = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;
  formControls: IDynamicFormControl[];

  private operators: IMetadataFilterOperator[] = [];
  private columnsMetadata: IMetadataColumn[];

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
    .filter(([attributes, metadata]) => metadata.columns && metadata.filters)
    .subscribe(([attributes, metadata]) => {
      this.formControls = this.buildFormControls(metadata.filters);
      this.operators = metadata.filters.operators;
      this.columnsMetadata = metadata.columns;
      this.cdRef.markForCheck();
    });
  }

  get filters(): FilterObject {
    const filter = FilterObject.create().and();
    const data = this.form && this.form.serializedUpdates || {};

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

  onFilter(): void {
    this.filter.emit();
  }


  private buildFormControls(metadata: IMetadataFilter): IDynamicFormControl[] {
    return [
      ...metadata.controls,
      {
        label: 'default.buttons.search',
        controlName: 'searchBtn',
        type: 'searchBtn',
        iconCls: 'fa-search',
        width: 3,
        action: () => this.onFilter()
      }
    ];
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
        return values.length === 1 ? this.valueConverterService.makeRangeFromLocalDate(values[0]) :
        [...values.map(this.valueConverterService.toISO)];
      default:
        return values;
    }
  }
}
