import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ColDef } from 'ag-grid';

import { FilterConditionType, FilterOperatorType, FilterObject } from '../../grid2/filter/grid-filter';

@Component({
  selector: 'app-qbuilder2-group',
  templateUrl: './qbuilder2-group.component.html',
  styleUrls: [ './qbuilder2-group.component.scss' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QBuilder2GroupComponent {
  static DEFAULT_CONDITION: FilterConditionType = 'AND';
  static DEFAULT_OPERATOR: FilterOperatorType = '==';

  @Input() columns: Array<ColDef>;
  @Input() filter: FilterObject;

  @Output() onAddGroup = new EventEmitter<void>();
  @Output() onAddCondition = new EventEmitter<void>();
  @Output() onRemove = new EventEmitter<void>();

  addGroup(): void {
    const group = new FilterObject();
    group.setCondition(QBuilder2GroupComponent.DEFAULT_CONDITION);
    group.setFilters([ this.createCondition() ]);
    this.filter.filters.push(group);
  }

  addCondition(): void {
    const condition = this.createCondition();
    this.filter.filters.push(condition);
  }

  remove(): void {
    this.onRemove.emit();
  }

  removeChild(i: number): void {
    this.filter.filters.splice(i, 1);
    if (this.filter.filters.length === 0) {
      this.remove();
    }
  }

  private createCondition(): FilterObject {
    const filter = new FilterObject();
    filter.setOperator(QBuilder2GroupComponent.DEFAULT_OPERATOR);
    return filter;
  }
}
