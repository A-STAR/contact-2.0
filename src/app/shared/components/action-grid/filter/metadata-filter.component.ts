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

import { FilterObject, FilterOperatorType } from '../../../../shared/components/grid2/filter/grid-filter';
import { IAppState } from '../../../../core/state/state.interface';
import { IDynamicFormControl, IFilterControl } from '../../form/dynamic-form/dynamic-form.interface';
import { IMetadataColumn } from '../../../../core/metadata/metadata.interface';

import { EntityAttributesService } from '../../../../core/entity/attributes/entity-attributes.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';
import { MetadataFilterService } from '../../../../shared/components/metadata-grid/filter/metadata-filter.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { TYPE_CODES } from '../../../../core/utils/value';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-metadata-filter',
  templateUrl: './metadata-filter.component.html'
})
export class MetadataFilterComponent implements OnInit {
  @Input() metadataKey: string;

  @Output() filter = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  filterControls: IFilterControl[];
  formControls: IDynamicFormControl[];

  private columnsMetadata: IMetadataColumn[];

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService,
    private metadataFilterService: MetadataFilterService
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
      this.filterControls = this.metadataFilterService.createFilterControls(metadata.filters);
      this.formControls = this.buildFormControls(this.filterControls);
      this.columnsMetadata = metadata.columns;
      this.cdRef.markForCheck();
    });
  }

  get filters(): FilterObject {
    const filter = FilterObject.create().and();
    const data = this.form && this.form.serializedValue || {};
    Object.keys(data).forEach(key => {
      if (data[key]) {
        const f = FilterObject
          .create()
          .setName(key)
          .setOperator(this.getOperatorForControl(key))
          .setValues(this.transformFilterValue(key, data[key]));
        filter.addFilter(f);
      }
    });
    return filter;
  }

  onFilter(): void {
    this.filter.emit();
  }

  private buildFormControls(filterControls: IFilterControl[]): IDynamicFormControl[] {
    return [
      ...filterControls,
      {
        label: 'default.buttons.search',
        controlName: 'searchBtn',
        type: 'searchBtn',
        iconCls: 'fa-search',
        width: 3,
        action: () => this.onFilter()
      }
    ] as IDynamicFormControl[];
  }

  private getOperatorForControl(controlName: string): FilterOperatorType {
    const control = this.filterControls.find(c => c.controlName === controlName);
    return (control && control.operator) || '==';
  }

  private transformFilterValue(key: string, value: any): any {
    const columnMetadata = this.columnsMetadata.find(column => column.name === key);
    switch (columnMetadata.dataType) {
      case TYPE_CODES.DATETIME:
        return this.valueConverterService.makeRangeFromLocalDate(value);
      default:
        return value;
    }
  }
}
