import { Component } from '@angular/core';
import { IGroup } from '../../shared/components/qbuilder/qbuilder.interface';
import { QBuilderService } from '../../shared/components/qbuilder/qbuilder.service';

@Component({
  selector: 'app-querybuilder',
  templateUrl: './querybuilder.component.html'
})
export class QueryBuilderComponent {

  /**
   * Whether the query builder dialog is shown or not
   * @memberOf QueryBuilderComponent
   */
  isQueryBuilderDialogVisible = false;

  /**
   * Whether the query builder is shown inside the dialog (true) or the resulting json (false)
   * @memberOf QueryBuilderComponent
   */
  isQueryBuilderShown = true;

  group: IGroup;

  constructor(private builderService: QBuilderService) {
    this.resetGroup();
  }

  resetGroup(): void {
    this.group = {
      operator: null,
      rules: []
    };
  }

  showQueryBuilderDialog(): void {
    this.isQueryBuilderDialogVisible = true;
  }

  toggleBetweenQueryBuilderAndResultingJson(): void {
    this.isQueryBuilderShown = !this.isQueryBuilderShown;
  }

  onQueryBuilderDialogHide(): void {
    this.resetGroup();
  }

  toJson(group: any): string {
    return this.builderService.toJson(group);
  }
}
