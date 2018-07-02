import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { PersonSearchService } from '@app/routes/workplaces/shared/person-search/person-search.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { layout } from './person-search-filter.layout';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-person-search-filter',
  templateUrl: 'person-search-filter.component.html'
})
export class PersonSearchFilterComponent {

  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  constructor(
    private personSearchService: PersonSearchService,
  ) {}

  readonly filterFormLayout = layout;

  onClear(): void {
    this.layout.resetForm();
    this.personSearchService.filtersFormData = null;
    this.personSearchService.search();
  }

  onSearch(): void {
    this.personSearchService.filtersFormData = this.layout.getData();
    this.personSearchService.search();
  }
}
