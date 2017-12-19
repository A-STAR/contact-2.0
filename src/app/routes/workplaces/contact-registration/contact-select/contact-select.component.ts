import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';

import { ContactSelectCardComponent } from './card/contact-select-card.component';
import { ContactSelectGridComponent } from './grid/contact-select-grid.component';
import { ContactSelectSearchComponent } from './search/contact-select-search.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-contact-registration-contact-select',
  templateUrl: 'contact-select.component.html'
})
export class ContactSelectComponent implements AfterViewInit {
  @Input() debtId: number;
  @Input() personId: number;

  @ViewChild(ContactSelectCardComponent) selectCard: ContactSelectCardComponent;
  @ViewChild(ContactSelectGridComponent) selectGrid: ContactSelectGridComponent;
  @ViewChild(ContactSelectSearchComponent) selectSearch: ContactSelectSearchComponent;

  private personSelectComponent: ContactSelectCardComponent | ContactSelectGridComponent | ContactSelectSearchComponent;

  constructor(
    private cdRef: ChangeDetectorRef,
  ) {}

  get isValid(): any {
    return this.personSelectComponent && this.personSelectComponent.isValid;
  }

  get person(): any {
    return this.personSelectComponent && this.personSelectComponent.person;
  }

  ngAfterViewInit(): void {
    this.personSelectComponent = this.selectGrid;
  }

  onTabSelect(tabIndex: number): void {
    switch (tabIndex) {
      case 0:
        this.personSelectComponent = this.selectGrid;
        break;
      case 1:
        this.personSelectComponent = this.selectSearch;
        break;
      case 2:
        this.personSelectComponent = this.selectCard;
        break;
    }
    this.cdRef.markForCheck();
  }
}
