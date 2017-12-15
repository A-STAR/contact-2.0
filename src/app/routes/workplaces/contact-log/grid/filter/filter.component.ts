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
import { Subscription } from 'rxjs/Subscription';
import { first } from 'rxjs/operators';

import { ContactsGridKeys } from '../../contact-log.interface';
import { FilterObject, FilterOperatorType } from '../../../../../shared/components/grid2/filter/grid-filter';
import { IAppState } from '../../../../../core/state/state.interface';
import { IDynamicFormControl } from '../../../../../shared/components/form/dynamic-form/dynamic-form.interface';
import { IEntityAttributes } from '../../../../../core/entity/attributes/entity-attributes.interface';
import { TYPE_CODES } from '../../../../../core/utils/value';

import { EntityAttributesService } from '../../../../../core/entity/attributes/entity-attributes.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';
import { ValueConverterService } from '../../../../../core/converter/value-converter.service';

import { DynamicFormComponent } from '../../../../../shared/components/form/dynamic-form/dynamic-form.component';

import { makeKey, range } from '../../../../../core/utils';

const labelKey = makeKey('modules.contactLog.filters.form');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-workplaces-contact-log-grid-filter',
  templateUrl: 'filter.component.html'
})
export class FilterComponent implements OnInit {
  @Input() gridKey: ContactsGridKeys;
  @Output() search = new EventEmitter<void>();

  @ViewChild(DynamicFormComponent) form: DynamicFormComponent;

  controls: IDynamicFormControl[];

  private dateTimeFormat: number;
  private metadataSub: Subscription;

  constructor(
    private cdRef: ChangeDetectorRef,
    private entityAttributesService: EntityAttributesService,
    private store: Store<IAppState>,
    private valueConverterService: ValueConverterService
  ) {}

  ngOnInit(): void {
    this.entityAttributesService.getDictValueAttributes()
      .pipe(first())
      .subscribe(attributes => {
        this.controls = this.buildControls(attributes);
        this.cdRef.markForCheck();
      });
    this.metadataSub = this.store
      .select(state => state.metadata)
      .filter(Boolean)
      .map(metadata => this.getMetadataSlice(metadata))
      .filter(Boolean)
      .map(contactLog => contactLog.columns)
      .map(columns => columns.find(column => column.name === this.getDateControlName()))
      .map(column => column && column.dataType)
      .subscribe(columnDataType => this.dateTimeFormat = columnDataType);
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

  onSearch(): void {
    this.search.emit();
  }

  private buildControls(attributes: IEntityAttributes): IDynamicFormControl[] {
    return [
      {
        controlName: 'portfolioId',
        type: 'dialogmultiselectwrapper',
        filterType: 'portfolios',
        filterParams: { directionCodes: [ 1 ] }
      },
      {
        controlName: 'outPortfolioId',
        type: 'dialogmultiselectwrapper',
        filterType: 'portfolios',
        filterParams: { directionCodes: [ 2 ] }
      },
      { controlName: 'branchCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_BRANCHES },
      { controlName: 'regionCode', type: 'selectwrapper', dictCode: UserDictionariesService.DICTIONARY_REGIONS },
      ...range(1, 4).map(i => ({
        controlName: `dictValue${i}`,
        type: 'selectwrapper',
        dictCode: UserDictionariesService[`DICTIONARY_DEBT_LIST_${i}`],
        display: attributes[EntityAttributesService[`DICT_VALUE_${i}`]].isUsed,
      })),
      { controlName: 'userId', type: 'dialogmultiselectwrapper', filterType: 'users' },
      { controlName: this.getDateControlName(), type: 'datepicker' },
      {
        controlName: 'searchBtn',
        type: 'searchBtn',
        iconCls: 'fa-search',
        action: () => this.onSearch(),
      },
    ]
    .map(control => ({
      ...control,
      label: labelKey(control.controlName),
      width: 3
    } as IDynamicFormControl));
  }

  private getOperatorForControl(controlName: string): FilterOperatorType {
    const control = this.controls.find(c => c.controlName === controlName);
    switch (control.controlName) {
      case 'portfolioId':
      case 'outPortfolioId':
      case 'userId':
        return 'IN';
      case 'createDateTime':
      case 'receiveDateTime':
        return 'BETWEEN';
      default:
        return '==';
    }
  }

  private transformFilterValue(key: string, value: any): any {
    switch (key) {
      case this.getDateControlName():
        return this.dateTimeFormat === TYPE_CODES.DATETIME
          ? this.valueConverterService.makeRangeFromLocalDate(this.valueConverterService.dateStringToISO(value))
          : value;
      default:
        return value;
    }
  }

  private getDateControlName(): string {
    switch (this.gridKey) {
      case ContactsGridKeys.CONTACT:
      case ContactsGridKeys.SMS:
      case ContactsGridKeys.EMAIL:
        return 'createDateTime';
      case ContactsGridKeys.PROMISE:
        return 'receiveDateTime';
    }
  }

  private getMetadataSlice(metadata: any): any {
    switch (this.gridKey) {
      case ContactsGridKeys.CONTACT:
        return metadata.contactLogContact;
      case ContactsGridKeys.PROMISE:
        return metadata.contactLogPromise;
      case ContactsGridKeys.SMS:
        return metadata.contactLogSMS;
      case ContactsGridKeys.EMAIL:
        return metadata.contactLogEmail;
    }
  }
}
