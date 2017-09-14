import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/distinctUntilChanged';

import { IAttribute, IAttributeResponse } from '../attribute.interface';
import { IGridTreeColumn, IGridTreeRow } from '../../../../components/gridtree/gridtree.interface';
import { IOption } from '../../../../../core/converter/value-converter.interface';

import { AttributeService } from '../attribute.service';
import { UserDictionariesService } from '../../../../../core/user/dictionaries/user-dictionaries.service';

@Component({
  selector: 'app-attribute-grid',
  templateUrl: './attribute-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttributeGridComponent {
  private _columns: Array<IGridTreeColumn<IAttribute>> = [
    { label: 'Id', prop: 'id' },
    { label: 'Name', prop: 'name' },
    { label: 'Code', prop: 'code' },
  ];

  private _attributes: IAttributeResponse[] = [];

  constructor(
    private attributeService: AttributeService,
    private cdRef: ChangeDetectorRef,
    private userDictionariesService: UserDictionariesService,
  ) {
    this.fetch(1);
  }

  get options$(): Observable<IOption[]> {
    return this.userDictionariesService
      .getDictionaryAsOptions(UserDictionariesService.DICTIONARY_ATTRIBUTE_TREE_TYPE)
      .distinctUntilChanged();
  }

  get columns(): Array<IGridTreeColumn<IAttribute>> {
    return this._columns;
  }

  get rows(): Array<IGridTreeRow<IAttribute>> {
    return this.convertToGridTreeRow(this._attributes);
  }

  onChange(event: Event): void {
    this.fetch(Number((event.target as HTMLSelectElement).value));
  }

  private convertToGridTreeRow(attributes: IAttributeResponse[]): IGridTreeRow<IAttribute>[] {
    return attributes.map(attribute => {
      const { children, ...rest } = attribute;
      const hasChildren = children && children.length > 0;
      return hasChildren
        ? { data: rest, children: this.convertToGridTreeRow(children), isExpanded: hasChildren }
        : { data: rest };
    });
  }

  private fetch(type: number): void {
    this.attributeService.fetchAll(type).subscribe(attributes => this._attributes = attributes);
    this.cdRef.markForCheck();
  }
}
