import { Component, Input } from '@angular/core';
import { Http } from '@angular/http';
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

  resetGroup() {
    this.group = {
      operator: null,
      rules: []
    }
  }

  showQueryBuilderDialog() {
    this.isQueryBuilderDialogVisible = true;
  }

  toggleBetweenQueryBuilderAndResultingJson() {
    this.isQueryBuilderShown = !this.isQueryBuilderShown;
  }

  onQueryBuilderDialogHide() {
    this.resetGroup();
  }

  toJson(group) {
    return this.builderService.toJson(group);
  }
}
