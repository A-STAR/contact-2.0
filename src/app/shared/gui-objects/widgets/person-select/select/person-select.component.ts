import {
  AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef,
  Component, ViewChild, Input
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { IPerson, PersonSelectorComponent } from '../person-select.interface';

import { PersonSelectGridComponent } from '../grid/person-select-grid.component';
import { PersonSelectCardComponent } from '../card/person-select-card.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-person-select',
  templateUrl: './person-select.component.html'
})
export class PersonSelectComponent implements AfterViewInit {

  @Input() set person(person: IPerson) {
    this.personExists = !!person;
    if (person) {
      this.card.value = person;
    }
  }

  @ViewChild(PersonSelectGridComponent) grid: PersonSelectGridComponent;
  @ViewChild(PersonSelectCardComponent) card: PersonSelectCardComponent;

  personExists = false;

  private personSelectComponent: PersonSelectorComponent;

  constructor(private cdRef: ChangeDetectorRef) { }

  get personSelectComponents(): PersonSelectorComponent[] {
    return [ this.grid, this.card ];
  }

  get canSubmit(): boolean {
    return this.personSelectComponent && this.personSelectComponent.isValid;
  }

  get selectedPerson(): Observable<IPerson> {
    return this.personSelectComponent && this.personSelectComponent.person;
  }

  ngAfterViewInit(): void {
    this.personSelectComponent = this.personSelectComponents[0];
  }

  onTabSelect(tabIndex: number): void {
    this.personSelectComponent = this.personSelectComponents[tabIndex];
    this.cdRef.markForCheck();
  }
}
