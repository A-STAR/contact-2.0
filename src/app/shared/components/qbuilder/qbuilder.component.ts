import { Component, Input } from '@angular/core';
import { IGroup, IField, IOperator, ICondition } from './qbuilder.interface';
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

  get operators(): Array<IOperator> {
    return this.builderService.getOperators();
  }

  get conditions(): Array<IField> {
    return this.builderService.getConditions();
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

  trackByFn(index: number, item: any): number {
    return index;
  }
}
