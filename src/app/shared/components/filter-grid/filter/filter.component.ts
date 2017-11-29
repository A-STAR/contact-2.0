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
import { IFilterControl } from '../filter-grid.interface';
import { IEntityAttributes } from '../../../../core/entity/attributes/entity-attributes.interface';
import { TYPE_CODES } from '../../../../core/utils/value';
import { IMetadataColumn } from '../../../../core/metadata/metadata.interface';

import { EntityAttributesService } from '../../../../core/entity/attributes/entity-attributes.service';
import { ValueConverterService } from '../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../shared/components/form/dynamic-form/dynamic-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-grid-filter',
  templateUrl: 'filter.component.html'
})
export class GridFilterComponent implements OnInit {
  @Input() gridKey: string;
  @Input() controls: IFilterControl[];

  @Output() filter = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  private metadata: IMetadataColumn[];

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
        .map(metadata => metadata && metadata[this.gridKey])
        .filter(Boolean)
    )
    .pipe(first())
    .subscribe(([attributes, metadata]) => {
      this.controls = this.buildControls(attributes);
      this.metadata = metadata.columns;
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

  private buildControls(attributes: IEntityAttributes): IFilterControl[] {
    return [
      ...this.controls.map(
        control => control.type === 'searchBtn'
          ? { ...control, action: () => this.onFilter() }
          : control
      )
    ];
  }

  private getOperatorForControl(controlName: string): FilterOperatorType {
    const control = this.controls.find(c => c.controlName === controlName);
    return control.operator || '==';
  }

  private transformFilterValue(key: string, value: any): any {
    const columnMetadata = this.metadata.find(column => column.name === key);
    switch (columnMetadata.dataType) {
      case TYPE_CODES.DATETIME:
        return this.valueConverterService.dateStringToISO(value);
      default:
        return value;
    }
  }
}
