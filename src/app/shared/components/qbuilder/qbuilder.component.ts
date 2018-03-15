import { Component, Input } from '@angular/core';
import { IGroup, IField, ILogicalOperator, IComparisonOperator, ICondition } from './qbuilder.interface';
import { QBuilderService } from './qbuilder.service';

@Component({
  selector: 'app-qbuilder',
  templateUrl: './qbuilder.component.html',
  styleUrls: ['./qbuilder.component.scss']
})
export class QBuilderComponent {
  @Input() group: IGroup;

  constructor(private builderService: QBuilderService) { }

  get fields(): Array<IField> {
    return this.builderService.getFields();
  }

  get logicalOperators(): Array<ILogicalOperator> {
    return this.builderService.getLogicalOperators();
  }

  getComparisonOperators(condition: ICondition): Array<IComparisonOperator> {
    return this.builderService.getComparisonOperators(condition);
  }

  addCondition(): void {
    this.builderService.addCondition(this.group);
  }

  removeCondition(index: number): void {
    this.builderService.removeCondition(this.group, index);
  }

  addGroup(): void {
    this.builderService.addGroup(this.group);
  }

  removeGroup(group: IGroup): void {
    this.builderService.removeGroup(group);
  }

  isGroup(rule: ICondition | IGroup): boolean {
    return rule.hasOwnProperty('rules');
  }

  getType(condition: ICondition): string {
    return Array.isArray(condition.field.type) ? 'dictionary' : condition.field.type;
  }

  onFieldChange(condition: ICondition): void {
    condition.value = null;
  }

  trackByFn(index: number): number {
    return index;
  }
}
