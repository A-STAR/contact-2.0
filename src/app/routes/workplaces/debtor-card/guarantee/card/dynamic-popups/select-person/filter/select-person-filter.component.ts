import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';

import { SelectPersonService } from '../select-person.service';

import { DynamicLayoutComponent } from '@app/shared/components/dynamic-layout/dynamic-layout.component';

import { layout } from './select-person-filter.layout';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'full-size' },
  selector: 'app-guarantee-card-select-person-filter',
  templateUrl: 'select-person-filter.component.html'
})
export class SelectPersonFilterComponent {
  @ViewChild(DynamicLayoutComponent) layout: DynamicLayoutComponent;

  constructor(
    private selectPersonService: SelectPersonService,
  ) {}

  readonly filterFormLayout = layout;

  onClear(): void {
    this.layout.resetForm();
    this.selectPersonService.filtersFormData = null;
    this.selectPersonService.search();
  }

  onSearch(): void {
    this.selectPersonService.filtersFormData = this.layout.getData();
    this.selectPersonService.search();
  }
}
