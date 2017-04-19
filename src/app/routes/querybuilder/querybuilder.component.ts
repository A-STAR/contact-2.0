import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { QBuilderService } from '../../shared/components/qbuilder/qbuilder.service';

@Component({
  selector: 'app-querybuilder',
  templateUrl: './querybuilder.component.html',
})
export class QueryBuilderComponent {
  group = {
    operator: 'AND',
    rules: []
  };

  constructor(private builderService: QBuilderService) {}

  toString(group) {
    return this.builderService.toString(group);
  }
}
